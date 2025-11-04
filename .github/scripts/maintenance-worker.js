addEventListener("fetch", (event) => {
  event.respondWith(
    new Response(MAINTENANCE_HTML, {
      status: 503,
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Retry-After": "120",
      },
    })
  );
});
