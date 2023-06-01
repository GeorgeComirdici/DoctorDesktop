using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public enum OrderStatus
    {
        [EnumMember(Value = "Pending")] //attributes used to return the actual status of the order instead of just numbers
        //possible states of the order
        Pending,
        [EnumMember(Value = "Payment received")]
        PaymentReceived,
        [EnumMember(Value = "Payment failed")]
        PaymentFailed
    }
}