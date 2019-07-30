using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace incasement.Models
{
    public class Box
    {
        public double _nominal_length { get; set; }
        public double _nominal_width{ get; set; }
        public double _nominal_height { get; set; }
        public double _true_length { get; set; }
        public double _true_width { get; set; }
        public double _true_height { get; set; }
        public int[] exchange { get; set; }
        public double exchange_x { get; set; }
        public double exchange_y { get; set; }
        public double exchange_z { get; set; }
        public double _x { get; set; }
        public double _y { get; set; }
        public double _z { get; set; }
        public double center_x { get; set; }
        public double center_y { get; set; }
        public double center_z { get; set; }
        public double Area { get; set; }
        public double vol{ get; set; }//体积
        public double weight { get; set; }//重量
        public Box(double l,double w,double h,double x, double y, double z,double weight)
        {
            this.weight = weight;
            exchange = new int[3];
            _nominal_length = l;
            _nominal_width = w;
            _nominal_height = h;
            exchange_x = l;
            exchange_y = h;
            exchange_z = w;
            _x = x;
            _y = y;
            _z = z;
            vol = l * w * h;
            if (l >= w && l >= h)
            {
                _true_length = l;
                exchange[0] = 0;
                if (w >= h)
                {
                    _true_width = w;
                    exchange[1] = 1;
                    _true_height = h;
                    exchange[2] = 2;
                }
                else
                {
                    _true_width = h;
                    exchange[2] = 1;
                    _true_height = w;
                    exchange[1] = 2;
                }
            }
            else if(w>=l && w >= h)
            {
                _true_length = w;
                exchange[1] = 0;
                if (l >= h)
                {
                    _true_width = l;
                    exchange[0] = 1;
                    _true_height = h;
                    exchange[2] = 2;
                }
                else
                {
                    _true_width = h;
                    exchange[2] = 1;
                    _true_height = l;
                    exchange[0] = 2;
                }
            }
            else
            {
                _true_length = h;
                exchange[2] = 0;
                if (l >= w)
                {
                    _true_width = l;
                    exchange[0] = 1;
                    _true_height = w;
                    exchange[1] = 2;
                }
                else
                {
                    _true_width = w;
                    exchange[1] = 1;
                    _true_height = l;
                    exchange[0] = 2;
                }
            }
            Area = _true_length * _true_width;
            this.getCenterPoint();
        }
        public void getCenterPoint()
        {
            center_x = _x + exchange_x/2;
            center_y = _y + exchange_y / 2;
            center_z = _z + exchange_z / 2;
        }
        public void setContainer()
        {
            exchange_x = _nominal_length;
            exchange_y = _nominal_width;
            exchange_z = _nominal_height;
            if (exchange_x == _true_length)
            {
                exchange[0] = 0;
            }
            else if (exchange_x == _true_width)
            {
                exchange[0] = 1;
            }
            else
            {
                exchange[0] = 2;
            }
            //
            if (exchange_y == _true_length)
            {
                exchange[1] = 0;
            }
            else if (exchange_y == _true_width)
            {
                exchange[1] = 1;
            }
            else
            {
                exchange[1] = 2;
            }
            //
            if (exchange_z == _true_length)
            {
                exchange[2] = 0;
            }
            else if (exchange_z == _true_width)
            {
                exchange[2] = 1;
            }
            else
            {
                exchange[2] = 2;
            }
            if(exchange[0] == exchange[1]&& exchange[2] == exchange[1]) { exchange[0] = 0; exchange[1] = 1; exchange[2] = 2; }
            if(exchange[0]== exchange[1])
            {
                switch (exchange[2])
                {
                    case 0: { exchange[0] = 1; exchange[1] = 2;break; }
                    case 1: { exchange[0] = 0; exchange[1] = 2; break; }
                    case 2: { exchange[0] = 0; exchange[1] = 1; break; }
                }
            }
            if(exchange[0] == exchange[2])
            {
                switch (exchange[1])
                {
                    case 0: { exchange[0] = 1; exchange[2] = 2; break; }
                    case 1: { exchange[0] = 0; exchange[2] = 2; break; }
                    case 2: { exchange[0] = 0; exchange[2] = 1; break; }
                }
            }
            if(exchange[1] == exchange[2])
            {
                switch (exchange[0])
                {
                    case 0: { exchange[1] = 1; exchange[2] = 2; break; }
                    case 1: { exchange[1] = 0; exchange[2] = 2; break; }
                    case 2: { exchange[1] = 0; exchange[2] = 1; break; }
                }
            }
            this.getCenterPoint();
        }
        public Box Clone()
        {
            return (Box)this.MemberwiseClone();
        }
    }
}