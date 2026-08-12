using Docker.OnlineShop.Api.Models;
using Docker.OnlineShop.Api.Models.Utility;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;

namespace Docker.OnlineShop.Api.Controllers
{
    [RoutePrefix("onlineshop/utility")]
    public class UtilityController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [Route("containerid")]
        public async Task<IHttpActionResult> GetContainerId()
        {
            var server = new Server
            {
                Host = Dns.GetHostName()
            };

            var ipHost = await Dns.GetHostEntryAsync(server.Host);
            server.Ip = ipHost.AddressList.First().ToString();

            return Ok(server);
        }

        [Route("healthcheck")]
        public async Task<IHttpActionResult> GetHealthcheck ()
        {
            try
            {
                var result = await db.Database.SqlQuery<DateTime>("SELECT GETDATE()").FirstAsync();
                var response = new Database
                {
                    Status = result.ToString("yyyy-MM-dd HH:mm")
                };
                return Ok(response);
            }
            catch(Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
