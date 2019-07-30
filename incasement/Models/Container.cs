using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace incasement.Models
{
    public class Container:Box
    {
        public Cargo[] cargos;
        public double useratio { get; set; }//利用率
        public double loadweight = 0;//载重量 
        public Container(double l, double w, double h, double x, double y, double z, Cargo[] c,double weight) :base(l,w,h,x,y,z,weight)
        {
            cargos = c;
            double sum_vol = 0;
            double sum_weight = 0;
            foreach (Cargo cc in cargos)
            {
                sum_vol += cc.vol;
                sum_weight += cc.weight;
            }
            useratio = sum_vol / (this.vol);
            this.loadweight = sum_weight;
        }
        public double getUseratio()
        {
            double sum_vol = 0;
            double sum_weight = 0;
            foreach (Cargo cc in cargos)
            {
                sum_vol += cc.vol;
                sum_weight += cc.weight;
            }
            this.loadweight = sum_weight;
            return this.useratio = sum_vol / (this.vol);
        }
    }
    public class ContainerType
    {
        public double length { get; set; }
        public double width { get; set; }
        public double height { get; set; }
        public double weight { get; set; }//重量
        public void resort()
        {
            double l = length;
            double w = width;
            double h = height;
            if (l >= w && l >= h)
            {
                length = l;
                if (w >= h)
                {
                    width = h;
                    height = w;
                }
                else
                {
                    width = w;
                    height = h;
                }
            }
            else if (w >= l && w >= h)
            {
                length = w;
                if (l >= h)
                {
                    width = h;
                    height = l;
                }
                else
                {
                    width = l;
                    height = h;
                }
            }
            else
            {
                length = h;
                if (l >= w)
                {
                    width = w;
                    height = l;
                }
                else
                {
                    width = l;
                    height = w;
                }
            }
        }
        public ContainerType(double l,double w,double h,double weight)
        {
            this.weight = weight;
            if (l >= w && l >= h)
            {
                length = l;
                if (w >= h)
                {
                    width = h;
                    height = w;
                }
                else
                {
                    width = w;
                    height = h;
                }
            }
            else if (w >= l && w >= h)
            {
                length = w;
                if (l >= h)
                {
                    width = h;
                    height = l;
                }
                else
                {
                    width = l;
                    height = h;
                }
            }
            else
            {
                length = h;
                if (l >= w)
                {
                    width = w;
                    height = l;
                }
                else
                {
                    width = l;
                    height = w;
                }
            }
        }
    }
}