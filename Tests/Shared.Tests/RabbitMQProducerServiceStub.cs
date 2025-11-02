using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace Shared.Tests
{
    public class RabbitMQProducerServiceStub : RabbitMQProducerService
    {
        public RabbitMQProducerServiceStub() : base(null!) { }
    }
}