using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Data;
using API.Errors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly StoreContext _context;
        public BuggyController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet("testauth")]
        //[Authorize]
        public ActionResult<string> GetSecretText()
        {
            return "secret texttt";
        }
        [HttpGet("notfound")]
        public ActionResult GetNotFoundRequest()
        {
            var something = _context.Products.Find(422);
            if(something == null)
            {
                return NotFound(new ApiResponse(404));
            }
            return Ok();
        }

          [HttpGet("servererror")]
        public ActionResult GetServerError()
        {
            var something = _context.Products.Find(422);
            var somethingToReturn = something.ToString();
            return Ok();
        }

          [HttpGet("badrequest")]
        public ActionResult GetBadRequest()
        {
            return BadRequest(new ApiResponse(400));
        }

          [HttpGet("badrequest/{id}")]
        public ActionResult GetNotFoundRequest(int id)
        {
            return Ok();
        }
    }
}