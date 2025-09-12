FROM gitpod/workspace-full:latest

# Instalacja .NET SDK 9.0
RUN sudo wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh \
    && sudo chmod +x dotnet-install.sh \
    && sudo ./dotnet-install.sh --version latest --install-dir /usr/share/dotnet \
    && sudo ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet \
    && sudo rm dotnet-install.sh

# Instalacja Node.js i npm (dla React)
RUN sudo curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - \
    && sudo apt-get install -y nodejs

# Instalacja globalnych narzędzi npm
RUN sudo npm install -g npm@latest

# Dodanie zmiennych środowiskowych
ENV DOTNET_ROOT=/usr/share/dotnet \
    PATH="$PATH:/usr/share/dotnet"

# Weryfikacja instalacji
RUN dotnet --version && \
    node --version && \
    npm --version
