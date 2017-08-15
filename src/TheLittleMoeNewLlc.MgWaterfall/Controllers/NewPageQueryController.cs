using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TheLittleMoeNewLlc.MgWaterfall.DataObjects;

namespace TheLittleMoeNewLlc.MgWaterfall.Controllers
{
    public class NewPageQueryController : Controller
    {
        private IOptions<RpcEndpointConfiguration> m_rpcEndpointOptions;

        public NewPageQueryController(IOptions<RpcEndpointConfiguration> rpcEndpointOptions)
        {
            m_rpcEndpointOptions = rpcEndpointOptions;
        }
    }
}
