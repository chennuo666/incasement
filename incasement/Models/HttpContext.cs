using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Threading.Tasks;

namespace incasement.Models
{
    public static class HttpContext

    {

        private static IHttpContextAccessor _accessor;



        public static Microsoft.AspNetCore.Http.HttpContext Current => _accessor.HttpContext;



        internal static void Configure(IHttpContextAccessor accessor)

        {

            _accessor = accessor;

        }

        /// <summary> 
        /// 将一个object对象序列化，返回一个byte[]         
        /// </summary> 
        /// <param name="obj">能序列化的对象</param>         
        /// <returns></returns> 
        public static byte[] ObjectToBytes(object obj)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                IFormatter formatter = new BinaryFormatter(); formatter.Serialize(ms, obj);
                return ms.GetBuffer();
            }
        }

        /// <summary> 
        /// 将一个序列化后的byte[]数组还原         
        /// </summary>
        /// <param name="Bytes"></param>         
        /// <returns></returns> 
        public static object BytesToObject(byte[] Bytes)
        {
            using (MemoryStream ms = new MemoryStream(Bytes))
            {
                IFormatter formatter = new BinaryFormatter(); return formatter.Deserialize(ms);
            }
        }

    }
    public static class StaticHttpContextExtensions

    {

        public static void AddHttpContextAccessor1(this IServiceCollection services)

        {

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

        }



        public static IApplicationBuilder UseStaticHttpContext(this IApplicationBuilder app)

        {

            var httpContextAccessor = app.ApplicationServices.GetRequiredService<IHttpContextAccessor>();

            HttpContext.Configure(httpContextAccessor);

            return app;

        }
        
    }
}
