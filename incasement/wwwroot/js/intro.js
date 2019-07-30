var app2 = new Vue({
    el: '#main2',
    data: {
    },
    methods: {
        guidePath(num) {
            switch (num) {
                case 0:
                    window.location.href = '/HOME';
                    break;
                case 1:
                    window.location.href = '/HOME';
                    break;
                case 2:
                    window.location.href = '/HOME/Intro';
                    break;
                case 3:
                    window.location.href = '/HOME/UserPage';
                    break;
            }
        },
        getUserName() {
            $.ajax({
                type: "GET",
                url: "/api/Login",
                //data: JSON.stringify(jsondata),
                //contentType: 'application/json',
                async: false,
                error: function (err) { alert(JSON.stringify(err)); }
            });
            var v_cookie = JSON.parse($.cookie('account'));
            return v_cookie.userName;
        },
        LogOut() {
            $.ajax({
                type: "POST",
                url: "/api/LogOut",
                //data: JSON.stringify(jsondata),
                //contentType: 'application/json',
                async: false,
                success: function (data) {
                    if (data.Result === 1) {
                        app2.$message({
                            message: '退出成功！跳转页面中..',
                            type: 'success'
                        });
                        window.location.href = "/HOME/Login";
                    }
                    else {
                        app2.$message.error('退出失败，请重试');
                        return false;
                    }
                },
                error: function (err) { alert(JSON.stringify(err)); }
            });
        }
    }
});
var app1 = new Vue({
    el: '#main1',
    data: {
        show_container: '#intro_1',
        codeContent: [
            `public static Program RSO_3D(ContainerType ct, CargoNum[] cn)
{
    List<Container> containers = new List<Container>();
    int cargos_num = getCargoNum(cn);
    double[][] init_pop = getRandomCargoSort(1, cargos_num);
    List<CargoNum> pop = getCargoNumList(ct, cn, init_pop[0]);
    Program program = getProgram(ct, cn, pop);
    GAResult gar = new GAResult(program);
    return program;
}

public static int getCargoNum(CargoNum[] cn)//得到货物总个数
{
    int sum = 0;
    foreach (CargoNum value in cn)
    {
        sum += value.num;
    }
    return sum;
}

public static double[][] getRandomCargoSort(int row, int col)//得到箱子放置顺序序列，列是所有箱子，行是一个染色体，一个格子是一个箱子
{
    double[][] quene = new double[row][];
    quene[0] = new double[col];
    for (int kk = 0; kk < col; kk++)
    {
        quene[0][kk] = (double)((double)kk * (1 / (double)col));
    }
    if (row > 1)
    {
        quene[1] = new double[col];
        for (int kk = 0; kk < col; kk++)
        {
            quene[1][kk] = 0;
        }
    }
    for (int i = 2; i < row; i++)
    {
        quene[i] = new double[col];
        for (int j = 0; j < col; j++)
        {
            quene[i][j] = (double)((new Random(Guid.NewGuid().GetHashCode()).Next(100000)) / ((double)100000));
        }
    }
    return quene;
}

public static List<CargoNum> getCargoNumList(ContainerType ct, CargoNum[] cn, double[] cargos_sort)
{
    List<CargoNum> l_cn = new List<CargoNum>();
    foreach (CargoNum value in cn)
    {
        for (int i = 0; i < value.num; i++)
        {
            l_cn.Add(new CargoNum(value.length, value.width, value.height, 1, value.type, value.weight));
        }
    }
    l_cn.Sort((a, b) =>
    {
        if (a.Area.CompareTo(b.Area) != 0) return a.Area.CompareTo(b.Area);
        else return a.height.CompareTo(b.height);

    });
    l_cn.Reverse();
    //
    List<CargoNum> r_cn = new List<CargoNum>(l_cn.ToArray());
    int rank = 0;
    double[] copy_c = (double[])cargos_sort.Clone();
    while (copy_c.Min() <= 1)
    {
        r_cn[rank++] = l_cn[Array.IndexOf(copy_c, copy_c.Min())];
        copy_c[Array.IndexOf(copy_c, copy_c.Min())] = 1.1;
    }
    return r_cn;
}

public static Program getProgram(ContainerType ct, CargoNum[] t_cn, List<CargoNum> l_cn)
{
    List<Container> containers = new List<Container>();
    List<List<Box>> l_boxes = new List<List<Box>>();//剩余空间队列
    List<List<CargoNum>> cn = new List<List<CargoNum>>();
    List<bool> isdone = new List<bool>();
    isdone.Add(true);
    cn.Add(l_cn);
    int ct_num = 1;
    Task task = new Task(() => CalAsyncProgram(containers, l_boxes, ct_num, ct, t_cn, cn, isdone));
    task.Start();
    task.Wait();
    Program program = new Program(containers.ToArray(), t_cn);
    return program;
}

public static void CalAsyncProgram(List<Container> containers, List<List<Box>> l_boxes, int ct_num, ContainerType ct, CargoNum[] t_cn, List<List<CargoNum>> cn, List<bool> isdone)
{
    if (ct_num > containers.Count)
    {
        List<Cargo> cargos = new List<Cargo>();
        containers.Add(new Container(ct.length, ct.width, ct.height, 0, 0, (ct_num - 1) * (ct.height + (int)(ct.height / 3)), cargos.ToArray(), ct.weight));
        containers[ct_num - 1].setContainer();
        Box bbb = new Box(ct.length, ct.width, ct.height, 0, 0, (ct_num - 1) * (ct.height + (int)(ct.height / 3)), ct.weight);
        bbb.setContainer();
        l_boxes.Add(new List<Box>());
        l_boxes[ct_num - 1].Add(bbb);
    }
    isdone.Add(false);
    Task task = new Task(() => CalAsyncProgram(containers, l_boxes, ct_num + 1, ct, t_cn, cn, isdone));
    int i = 0;
    while (true)
    {
        if (i < cn[ct_num - 1].Count)
        {
            Boolean isStock = false;
            CargoNum l_cn = cn[ct_num - 1][i];
            while (l_cn == null) l_cn = cn[ct_num - 1][i];
            for (int j = 0; j < l_boxes[ct_num - 1].Count; j++)
            {
                //判断形状和重量是否满足剩余空间要求
                if (l_cn.height <= l_boxes[ct_num - 1][j]._true_height && l_cn.length <= l_boxes[ct_num - 1][j]._true_length && l_cn.width <= l_boxes[ct_num - 1][j]._true_width && containers[ct_num - 1].loadweight + l_cn.weight <= ct.weight)
                {
                    //判断地面放置方式
                    Cargo cargo = new Cargo(l_cn.length, l_cn.width, l_cn.height, l_boxes[ct_num - 1][j]._x, l_boxes[ct_num - 1][j]._y, l_boxes[ct_num - 1][j]._z, l_cn.type, l_cn.weight);
                    cargo = setCargo(l_boxes[ct_num - 1][j], cargo);
                    List<Cargo> cargos = new List<Cargo>(containers[ct_num - 1].cargos);
                    cargos.Add(cargo);
                    containers[ct_num - 1].cargos = cargos.ToArray();
                    containers[ct_num - 1].getUseratio();
                    Box[] r_box = getNextBox(l_boxes[ct_num - 1][j], cargo);
                    l_boxes[ct_num - 1].RemoveAt(j);
                    foreach (Box b in r_box) l_boxes[ct_num - 1].Add(b);
                    /*l_boxes[ct_num - 1].Sort((a, b) => {
                        if (a.Area.CompareTo(b.Area) != 0) return a.Area.CompareTo(b.Area);
                        else return a._true_height.CompareTo(b._true_height);
                    });
                    l_boxes[ct_num - 1].Reverse();*/
                    l_boxes[ct_num - 1] = remixRemainBox(l_boxes[ct_num - 1], t_cn);
                    isStock = true;
                    break;
                }
            }
            if (!isStock)
            {
                if (cn.Count == ct_num)
                {
                    cn.Add(new List<CargoNum>());
                    cn[ct_num].Add(cn[ct_num - 1][i]);
                    task.Start();
                }
                else
                {
                    cn[ct_num].Add(cn[ct_num - 1][i]);
                }
            }
            i++;
        }
        else
        {
            if (isdone[ct_num - 1] && i == cn[ct_num - 1].Count) break;
        }
    }
    isdone[ct_num] = true;
    if (task.Status != TaskStatus.Created) task.Wait();
}

public static List<Box> remixRemainBox(List<Box> l_boxes, CargoNum[] cn)
{
    for (int i = 0; i < l_boxes.Count; i++)
    {
        double r_x = l_boxes[i]._x + l_boxes[i].exchange_x;
        double r_y = l_boxes[i]._y + l_boxes[i].exchange_y;
        double r_z = l_boxes[i]._z + l_boxes[i].exchange_z;
        for (int j = 0; j < l_boxes.Count; j++)
        {
            double s1 = Math.Abs(l_boxes[i].vol - l_boxes[j].vol);
            double s2 = Math.Abs(l_boxes[i].vol - l_boxes[j].vol);
            Box temp_b1 = l_boxes[i];
            Box temp_b2 = l_boxes[j];
            if (l_boxes[j]._x == r_x && l_boxes[j]._y == l_boxes[i]._y && l_boxes[j]._z == l_boxes[i]._z)
            {
                if (l_boxes[j].exchange_y == l_boxes[i].exchange_y && l_boxes[j].exchange_z == l_boxes[i].exchange_z)
                {
                    l_boxes[i] = new Box(l_boxes[i].exchange_x + l_boxes[j].exchange_x, l_boxes[i].exchange_y, l_boxes[i].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                    l_boxes[i].setContainer();
                    l_boxes.RemoveAt(j);
                    if (i > j) i -= 2;
                    else if (i == j)
                        i -= 2;
                    else i--;
                    break;
                }
                else if (l_boxes[j].exchange_y == l_boxes[i].exchange_y)
                {
                    if (l_boxes[i].exchange_z > l_boxes[j].exchange_z)
                    {
                        temp_b1 = new Box(l_boxes[i].exchange_x + l_boxes[j].exchange_x, l_boxes[i].exchange_y, l_boxes[j].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b2 = new Box(l_boxes[i].exchange_x, l_boxes[i].exchange_y, l_boxes[i].exchange_z - l_boxes[j].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z + l_boxes[j].exchange_z, 0);
                        temp_b1.setContainer();
                        temp_b2.setContainer();
                        s2 = Math.Abs(temp_b1.vol - temp_b2.vol);
                    }
                    else
                    {
                        temp_b1 = new Box(l_boxes[i].exchange_x + l_boxes[j].exchange_x, l_boxes[i].exchange_y, l_boxes[i].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b2 = new Box(l_boxes[j].exchange_x, l_boxes[i].exchange_y, l_boxes[j].exchange_z - l_boxes[i].exchange_z, l_boxes[j]._x, l_boxes[j]._y, l_boxes[j]._z + l_boxes[i].exchange_z, 0);
                        temp_b1.setContainer();
                        temp_b2.setContainer();
                        s2 = Math.Abs(temp_b1.vol - temp_b2.vol);
                    }
                }
                else if (l_boxes[j].exchange_z == l_boxes[i].exchange_z)
                {
                    if (l_boxes[i].exchange_y > l_boxes[j].exchange_y)
                    {
                        temp_b1 = new Box(l_boxes[i].exchange_x + l_boxes[j].exchange_x, l_boxes[j].exchange_y, l_boxes[i].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b2 = new Box(l_boxes[i].exchange_x, l_boxes[i].exchange_y - l_boxes[j].exchange_y, l_boxes[j].exchange_z, l_boxes[i]._x, l_boxes[i]._y + l_boxes[j].exchange_y, l_boxes[i]._z, 0);
                        temp_b1.setContainer();
                        temp_b2.setContainer();
                        s2 = Math.Abs(temp_b1.vol - temp_b2.vol);
                    }
                    else
                    {
                        temp_b1 = new Box(l_boxes[i].exchange_x + l_boxes[j].exchange_x, l_boxes[i].exchange_y, l_boxes[i].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b2 = new Box(l_boxes[j].exchange_x, l_boxes[j].exchange_y - l_boxes[i].exchange_y, l_boxes[j].exchange_z, l_boxes[j]._x, l_boxes[j]._y + l_boxes[i].exchange_y, l_boxes[j]._z, 0);
                        temp_b1.setContainer();
                        temp_b2.setContainer();
                        s2 = Math.Abs(temp_b1.vol - temp_b2.vol);
                    }
                }
            }
            else if (l_boxes[j]._z == r_z && l_boxes[j]._y == l_boxes[i]._y && l_boxes[j]._x == l_boxes[i]._x)
            {
                if (l_boxes[j].exchange_y == l_boxes[i].exchange_y && l_boxes[j].exchange_x == l_boxes[i].exchange_x)
                {
                    l_boxes[i] = new Box(l_boxes[i].exchange_x, l_boxes[i].exchange_y, l_boxes[i].exchange_z + l_boxes[j].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                    l_boxes[i].setContainer();
                    l_boxes.RemoveAt(j);
                    if (i > j) i -= 2;
                    else if (i == j)
                        i -= 2;
                    else i--;
                    break;
                }
                else if (l_boxes[j].exchange_y == l_boxes[i].exchange_y)
                {
                    if (l_boxes[i].exchange_x > l_boxes[j].exchange_x)
                    {
                        temp_b1 = new Box(l_boxes[j].exchange_x, l_boxes[i].exchange_y, l_boxes[i].exchange_z + l_boxes[j].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b2 = new Box(l_boxes[i].exchange_x - l_boxes[j].exchange_x, l_boxes[i].exchange_y, l_boxes[i].exchange_z, l_boxes[i]._x + l_boxes[j].exchange_x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b1.setContainer();
                        temp_b2.setContainer();
                        s2 = Math.Abs(temp_b1.vol - temp_b2.vol);
                    }
                    else
                    {
                        temp_b1 = new Box(l_boxes[i].exchange_x, l_boxes[i].exchange_y, l_boxes[i].exchange_z + l_boxes[j].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b2 = new Box(l_boxes[j].exchange_x - l_boxes[i].exchange_x, l_boxes[i].exchange_y, l_boxes[j].exchange_z, l_boxes[j]._x + l_boxes[i].exchange_x, l_boxes[j]._y, l_boxes[j]._z, 0);
                        temp_b1.setContainer();
                        temp_b2.setContainer();
                        s2 = Math.Abs(temp_b1.vol - temp_b2.vol);
                    }
                }
                else if (l_boxes[j].exchange_x == l_boxes[i].exchange_x)
                {
                    if (l_boxes[i].exchange_y > l_boxes[j].exchange_y)
                    {
                        temp_b1 = new Box(l_boxes[i].exchange_x, l_boxes[j].exchange_y, l_boxes[i].exchange_z + l_boxes[j].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b2 = new Box(l_boxes[i].exchange_x, l_boxes[i].exchange_y - l_boxes[j].exchange_y, l_boxes[i].exchange_z, l_boxes[i]._x, l_boxes[i]._y + l_boxes[j].exchange_y, l_boxes[i]._z, 0);
                        temp_b1.setContainer();
                        temp_b2.setContainer();
                        s2 = Math.Abs(temp_b1.vol - temp_b2.vol);
                    }
                    else
                    {
                        temp_b1 = new Box(l_boxes[i].exchange_x, l_boxes[i].exchange_y, l_boxes[i].exchange_z + l_boxes[j].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b2 = new Box(l_boxes[j].exchange_x, l_boxes[j].exchange_y - l_boxes[i].exchange_y, l_boxes[j].exchange_z, l_boxes[j]._x, l_boxes[j]._y + l_boxes[i].exchange_y, l_boxes[j]._z, 0);
                        temp_b1.setContainer();
                        temp_b2.setContainer();
                        s2 = Math.Abs(temp_b1.vol - temp_b2.vol);
                    }
                }
            }
            else if (l_boxes[j]._y == r_y && l_boxes[j]._x == l_boxes[i]._x && l_boxes[j]._z == l_boxes[i]._z)
            {
                if (l_boxes[j].exchange_z == l_boxes[i].exchange_z && l_boxes[j].exchange_x == l_boxes[i].exchange_x)
                {
                    Box bbb1 = l_boxes[i].Clone();
                    Box bbb2 = l_boxes[j].Clone();
                    l_boxes[i] = new Box(l_boxes[i].exchange_x, l_boxes[i].exchange_y + l_boxes[j].exchange_y, l_boxes[i].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                    l_boxes[i].setContainer();
                    l_boxes.RemoveAt(j);
                    if (i > j) i -= 2;
                    else if (i == j)
                        i -= 2;
                    else i--;
                    break;
                }
                else if (l_boxes[j].exchange_z == l_boxes[i].exchange_z)
                {
                    if (l_boxes[i].exchange_x > l_boxes[j].exchange_x)
                    {
                        temp_b1 = new Box(l_boxes[j].exchange_x, l_boxes[i].exchange_y + l_boxes[j].exchange_y, l_boxes[i].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b2 = new Box(l_boxes[i].exchange_x - l_boxes[j].exchange_x, l_boxes[i].exchange_y, l_boxes[i].exchange_z, l_boxes[i]._x + l_boxes[j].exchange_x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b1.setContainer();
                        temp_b2.setContainer();
                        s2 = Math.Abs(temp_b1.vol - temp_b2.vol);
                    }
                    else
                    {
                        temp_b1 = new Box(l_boxes[i].exchange_x, l_boxes[i].exchange_y + l_boxes[j].exchange_y, l_boxes[i].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b2 = new Box(l_boxes[j].exchange_x - l_boxes[i].exchange_x, l_boxes[j].exchange_y, l_boxes[j].exchange_z, l_boxes[j]._x + l_boxes[i].exchange_x, l_boxes[j]._y, l_boxes[j]._z, 0);
                        temp_b1.setContainer();
                        temp_b2.setContainer();
                        s2 = Math.Abs(temp_b1.vol - temp_b2.vol);
                    }
                }
                else if (l_boxes[j].exchange_x == l_boxes[i].exchange_x)
                {
                    if (l_boxes[i].exchange_z > l_boxes[j].exchange_z)
                    {
                        temp_b1 = new Box(l_boxes[i].exchange_x, l_boxes[i].exchange_y + l_boxes[j].exchange_y, l_boxes[j].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b2 = new Box(l_boxes[i].exchange_x, l_boxes[i].exchange_y, l_boxes[i].exchange_z - l_boxes[j].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z + l_boxes[j].exchange_z, 0);
                        temp_b1.setContainer();
                        temp_b2.setContainer();
                        s2 = Math.Abs(temp_b1.vol - temp_b2.vol);
                    }
                    else
                    {
                        temp_b1 = new Box(l_boxes[i].exchange_x, l_boxes[i].exchange_y + l_boxes[j].exchange_y, l_boxes[i].exchange_z, l_boxes[i]._x, l_boxes[i]._y, l_boxes[i]._z, 0);
                        temp_b2 = new Box(l_boxes[j].exchange_x, l_boxes[j].exchange_y, l_boxes[j].exchange_z - l_boxes[i].exchange_z, l_boxes[j]._x, l_boxes[j]._y, l_boxes[j]._z + l_boxes[i].exchange_z, 0);
                        temp_b1.setContainer();
                        temp_b2.setContainer();
                        s2 = Math.Abs(temp_b1.vol - temp_b2.vol);
                    }
                }
            }
            if (s2 > s1)
            {
                l_boxes[i] = temp_b1;
                l_boxes[j] = temp_b2;
                if (i > j) i = j - 1;
                else i--;
                break;
            }
        }
    }
    l_boxes.Sort((a, b) => {
        if (a._y.CompareTo(b._y) != 0) return a._y.CompareTo(b._y);
        else return a.vol.CompareTo(b.vol);
    });
    //l_boxes.Reverse();
    return l_boxes;
}

public static Cargo setCargo(Box box, Cargo cg)
{
    if (box._true_width < cg._true_length)
    {
        //判断剩余空间的长在哪个坐标轴上
        if (box.exchange[0] == 0)
        {
            cg.exchange_x = cg._nominal_length;
        }
        else if (box.exchange[1] == 0)
        {
            cg.exchange_y = cg._nominal_length;
        }
        else
        {
            cg.exchange_z = cg._nominal_length;
        }
        //判断剩余空间的宽在哪个坐标轴上
        if (box.exchange[0] == 1)
        {
            cg.exchange_x = cg._nominal_width;
        }
        else if (box.exchange[1] == 1)
        {
            cg.exchange_y = cg._nominal_width;
        }
        else
        {
            cg.exchange_z = cg._nominal_width;
        }

    }
    else
    {
        //判断剩余空间的长在哪个坐标轴上
        if (box.exchange[0] == 0)
        {
            cg.exchange_x = cg._nominal_width;
        }
        else if (box.exchange[1] == 0)
        {
            cg.exchange_y = cg._nominal_width;
        }
        else
        {
            cg.exchange_z = cg._nominal_width;
        }
        //判断剩余空间的宽在哪个坐标轴上
        if (box.exchange[0] == 1)
        {
            cg.exchange_x = cg._nominal_length;
        }
        else if (box.exchange[1] == 1)
        {
            cg.exchange_y = cg._nominal_length;
        }
        else
        {
            cg.exchange_z = cg._nominal_length;
        }
    }
    //判断剩余空间的高在哪个坐标轴上
    if (box.exchange[0] == 2)
    {
        cg.exchange_x = cg._nominal_height;
    }
    else if (box.exchange[1] == 2)
    {
        cg.exchange_y = cg._nominal_height;
    }
    else
    {
        cg.exchange_z = cg._nominal_height;
    }
    cg.getCenterPoint();
    return cg;
}

public static Box[] getNextBox(Box box, Cargo cg)
{
    List<Box> lb = new List<Box>();
    double c_l;
    double c_w;
    if (box._true_width < cg._true_length)
    {
        c_l = cg._true_length;
        c_w = cg._true_width;
    }
    else
    {
        c_l = cg._true_width;
        c_w = cg._true_length;
    }
    double l_1 = box._true_length - c_l;
    double l_2 = box._true_width - c_w;
    double l_3 = box._true_height - cg._true_height;
    double s1 = Math.Abs((l_1) * box._true_width - (l_2) * c_l);
    double s2 = Math.Abs((l_1) * c_w - (l_2) * box._true_length);
    if (s1 > s2)
    {
        if (box.exchange[0] == 0 && box.exchange[2] == 1)
        {
            Box bb1 = new Box(c_l, l_3, c_w, box._x, box._y + cg._true_height, box._z, 0);
            bb1.setContainer();
            lb.Add(bb1);
            Box bb2 = new Box(l_1, box._true_height, box._true_width, box._x + c_l, box._y, box._z, 0);
            bb2.setContainer();
            lb.Add(bb2);
            Box bb3 = new Box(c_l, box._true_height, l_2, box._x, box._y, box._z + c_w, 0);
            bb3.setContainer();
            lb.Add(bb3);
        }
        else if (box.exchange[0] == 1 && box.exchange[2] == 0)
        {
            Box bb1 = new Box(c_w, l_3, c_l, box._x, box._y + cg._true_height, box._z, 0);
            bb1.setContainer();
            lb.Add(bb1);
            Box bb2 = new Box(l_2, box._true_height, c_l, box._x + c_w, box._y, box._z, 0);
            bb2.setContainer();
            lb.Add(bb2);
            Box bb3 = new Box(box._true_width, box._true_height, l_1, box._x, box._y, box._z + c_l, 0);
            bb3.setContainer();
            lb.Add(bb3);
        }
        else if (box.exchange[0] == 1 && box.exchange[1] == 0)
        {
            Box bb1 = new Box(c_w, c_l, l_3, box._x, box._y, box._z + cg._true_height, 0);
            bb1.setContainer();
            lb.Add(bb1);
            Box bb2 = new Box(l_2, c_l, box._true_height, box._x + c_w, box._y, box._z, 0);
            bb2.setContainer();
            lb.Add(bb2);
            Box bb3 = new Box(box._true_width, l_1, box._true_height, box._x, box._y + c_l, box._z, 0);
            bb3.setContainer();
            lb.Add(bb3);
        }
        else if (box.exchange[0] == 0 && box.exchange[1] == 1)
        {
            Box bb1 = new Box(c_l, c_w, l_3, box._x, box._y, box._z + cg._true_height, 0);
            bb1.setContainer();
            lb.Add(bb1);
            Box bb2 = new Box(l_1, box._true_width, box._true_height, box._x + c_l, box._y, box._z, 0);
            bb2.setContainer();
            lb.Add(bb2);
            Box bb3 = new Box(c_l, l_2, box._true_height, box._x, box._y + c_w, box._z, 0);
            bb3.setContainer();
            lb.Add(bb3);
        }
        else if (box.exchange[1] == 0 && box.exchange[2] == 1)
        {
            Box bb1 = new Box(l_3, c_l, c_w, box._x + cg._true_height, box._y, box._z, 0);
            bb1.setContainer();
            lb.Add(bb1);
            Box bb2 = new Box(box._true_height, c_l, l_2, box._x, box._y, box._z + c_w, 0);
            bb2.setContainer();
            lb.Add(bb2);
            Box bb3 = new Box(box._true_height, l_1, box._true_width, box._x, box._y + c_l, box._z, 0);
            bb3.setContainer();
            lb.Add(bb3);
        }
        else
        {
            Box bb1 = new Box(l_3, c_w, c_l, box._x + cg._true_height, box._y, box._z, 0);
            bb1.setContainer();
            lb.Add(bb1);
            Box bb2 = new Box(box._true_height, c_w, l_1, box._x, box._y, box._z + c_l, 0);
            bb2.setContainer();
            lb.Add(bb2);
            Box bb3 = new Box(box._true_height, l_2, box._true_length, box._x, box._y + c_w, box._z, 0);
            bb3.setContainer();
            lb.Add(bb3);
        }
    }
    else
    {
        if (box.exchange[0] == 0 && box.exchange[2] == 1)
        {
            Box bb1 = new Box(c_l, l_3, c_w, box._x, box._y + cg._true_height, box._z, 0);
            bb1.setContainer();
            lb.Add(bb1);
            Box bb2 = new Box(l_1, box._true_height, c_w, box._x + c_l, box._y, box._z, 0);
            bb2.setContainer();
            lb.Add(bb2);
            Box bb3 = new Box(box._true_length, box._true_height, l_2, box._x, box._y, box._z + c_w, 0);
            bb3.setContainer();
            lb.Add(bb3);
        }
        else if (box.exchange[0] == 1 && box.exchange[2] == 0)
        {
            Box bb1 = new Box(c_w, l_3, c_l, box._x, box._y + cg._true_height, box._z, 0);
            bb1.setContainer();
            lb.Add(bb1);
            Box bb2 = new Box(l_2, box._true_height, box._true_length, box._x + c_w, box._y, box._z, 0);
            bb2.setContainer();
            lb.Add(bb2);
            Box bb3 = new Box(c_w, box._true_height, l_1, box._x, box._y, box._z + c_l, 0);
            bb3.setContainer();
            lb.Add(bb3);
        }
        else if (box.exchange[0] == 1 && box.exchange[1] == 0)
        {
            Box bb1 = new Box(c_w, c_l, l_3, box._x, box._y, box._z + cg._true_height, 0);
            bb1.setContainer();
            lb.Add(bb1);
            Box bb2 = new Box(l_2, box._true_length, box._true_height, box._x + c_w, box._y, box._z, 0);
            bb2.setContainer();
            lb.Add(bb2);
            Box bb3 = new Box(c_w, l_1, box._true_height, box._x, box._y + c_l, box._z, 0);
            bb3.setContainer();
            lb.Add(bb3);
        }
        else if (box.exchange[0] == 0 && box.exchange[1] == 1)
        {
            Box bb1 = new Box(c_l, c_w, l_3, box._x, box._y, box._z + cg._true_height, 0);
            bb1.setContainer();
            lb.Add(bb1);
            Box bb2 = new Box(l_1, c_w, box._true_height, box._x + c_l, box._y, box._z, 0);
            bb2.setContainer();
            lb.Add(bb2);
            Box bb3 = new Box(box._true_length, l_2, box._true_height, box._x, box._y + c_w, box._z, 0);
            bb3.setContainer();
            lb.Add(bb3);
        }
        else if (box.exchange[1] == 0 && box.exchange[2] == 1)
        {
            Box bb1 = new Box(l_3, c_l, c_w, box._x + cg._true_height, box._y, box._z, 0);
            bb1.setContainer();
            lb.Add(bb1);
            Box bb2 = new Box(box._true_height, box._true_length, l_2, box._x, box._y, box._z + c_w, 0);
            bb2.setContainer();
            lb.Add(bb2);
            Box bb3 = new Box(box._true_height, l_1, c_w, box._x, box._y + c_l, box._z, 0);
            bb3.setContainer();
            lb.Add(bb3);
        }
        else
        {
            Box bb1 = new Box(l_3, c_w, c_l, box._x + cg._true_height, box._y, box._z, 0);
            bb1.setContainer();
            lb.Add(bb1);
            Box bb2 = new Box(box._true_height, box._true_width, l_1, box._x, box._y, box._z + c_l, 0);
            bb2.setContainer();
            lb.Add(bb2);
            Box bb3 = new Box(box._true_height, l_2, c_l, box._x, box._y + c_w, box._z, 0);
            bb3.setContainer();
            lb.Add(bb3);
        }
    }
    for (int i = 0; i < lb.Count; i++)
    {
        if (lb[i].vol == 0)
        {
            lb.RemoveAt(i);
            i--;
        }
    }
    return lb.ToArray();
}

public class GAResult
{
    public Program program { get; set; }
    public double fitness { get; set; }//适应度
    public double[] quene { get; set; }//排序序列
    public GAResult(Program p, double[] q)
    {
        program = p;
        quene = q;
        //计算fitness
        int c_num = p.Container_num;
        int k = 2;
        double sum = 0;
        foreach (Container value in p.containers)
        {
            sum += Math.Pow(value.useratio, k);
        }
        sum -= Math.Pow(p.containers[p.containers.Length - 1].useratio, k);
        fitness = 1000 / c_num + sum;
    }
    public GAResult(Program p)
    {
        program = p;
        //计算fitness
        int c_num = p.Container_num;
        int k = 2;
        double sum = 0;
        foreach (Container value in p.containers)
        {
            sum += Math.Pow(value.useratio, k);
        }
        sum -= Math.Pow(p.containers[p.containers.Length - 1].useratio, k);
        fitness = 1000 / c_num + sum;
    }
}`,
        `public static Program GA_3D(ContainerType ct, CargoNum[] cn)
{
    int popnum = 30;
    int cargos_num = getCargoNum(cn);
    double[][] init_pop = getRandomCargoSort(popnum, cargos_num);
    int NC_MAX = 500;
    GAResult[][] garesults = new GAResult[NC_MAX + 1][];
    GAResult bestGAR;
    int[][] BandWpop = new int[NC_MAX + 1][];
    garesults[0] = getGAResult(ct, cn, init_pop);
    double[] fit_arr = new double[popnum];
    for (int k = 0; k < popnum; k++)
    {
        fit_arr[k] = garesults[0][k].fitness;
    }
    BandWpop[0] = new int[2] { Array.IndexOf(fit_arr, garesults[0].Max(x => x.fitness)), Array.IndexOf(fit_arr, garesults[0].Min(x => x.fitness)) };
    bestGAR = garesults[0][BandWpop[0][0]];
    int MAX_exitnum = 0;
    for (int NC = 0; NC < NC_MAX; NC++)
    {
        DateTime dt1 = DateTime.Now;
        init_pop = GAOperation(ct, cn, garesults, init_pop, cargos_num, BandWpop, NC);
        //更新种群状态
        garesults[NC + 1] = getGAResult(ct, cn, init_pop);
        for (int k = 0; k < popnum; k++)
        {
            fit_arr[k] = garesults[NC + 1][k].fitness;
        }
        BandWpop[NC + 1] = new int[2] { Array.IndexOf(fit_arr, garesults[NC + 1].Max(x => x.fitness)), Array.IndexOf(fit_arr, garesults[NC + 1].Min(x => x.fitness)) };
        if (bestGAR.fitness < garesults[NC + 1][BandWpop[NC + 1][0]].fitness)
        {
            bestGAR = garesults[NC + 1][BandWpop[NC + 1][0]];
            MAX_exitnum = 0;
        }
        else MAX_exitnum++;
        if (MAX_exitnum > 50) break;
        DateTime dt2 = DateTime.Now;
        TimeSpan dd = dt2 - dt1;
    }
    return bestGAR.program;
}

public static double[][] GAOperation(ContainerType ct, CargoNum[] cn, GAResult[][] garesults, double[][] init_pop, int cargos_num, int[][] BandWpop, int NC)
{
    //交叉
    for (int i = 0; i < init_pop.Length; i++)
    {
        double[] temp_p = (double[])init_pop[i].Clone();
        int r_num = new Random(Guid.NewGuid().GetHashCode()).Next(cargos_num - 1);
        if (i != BandWpop[NC][0])
        {
            for (; r_num < init_pop[i].Length; r_num++)
            {
                init_pop[i][r_num] = init_pop[BandWpop[NC][0]][r_num];
            }
            double[][] temp_p2 = new double[1][];
            temp_p2[0] = init_pop[i];
            GAResult[] temp_gar = getGAResult(ct, cn, temp_p2);
            if (temp_gar[0].fitness < garesults[NC][BandWpop[NC][1]].fitness)
                init_pop[i] = temp_p;
        }
        else
        {
            double r_num2 = (double)((new Random(Guid.NewGuid().GetHashCode()).Next(100000)) / 100000);
            init_pop[i][r_num] = r_num2;
            double[][] temp_p2 = new double[1][];
            temp_p2[0] = init_pop[i];
            GAResult[] temp_gar = getGAResult(ct, cn, temp_p2);
            if (temp_gar[0].fitness < garesults[NC][BandWpop[NC][0]].fitness) init_pop[i] = temp_p;
        }
    }
    //变异
    for (int i = 0; i < init_pop.Length; i++)
    {
        double[] temp_p = (double[])init_pop[i].Clone();
        int r_num1 = new Random(Guid.NewGuid().GetHashCode()).Next(cargos_num);
        for (int j = 0; j < r_num1; j++)
        {
            int r_num2 = new Random(Guid.NewGuid().GetHashCode()).Next(cargos_num - 1);
            init_pop[i][r_num2] = (double)((new Random(Guid.NewGuid().GetHashCode()).Next(100000)) / 100000);
        }
        double[][] temp_p2 = new double[1][];
        temp_p2[0] = init_pop[i];
        GAResult[] temp_gar = getGAResult(ct, cn, temp_p2);
        if (i != BandWpop[NC][0])
        {
            if (temp_gar[0].fitness < garesults[NC][BandWpop[NC][1]].fitness) init_pop[i] = temp_p;
        }
        else
        {
            if (temp_gar[0].fitness < garesults[NC][BandWpop[NC][0]].fitness) init_pop[i] = temp_p;
        }
    }
    return init_pop;
}

public static GAResult[] getGAResult(ContainerType ct, CargoNum[] cn, double[][] quene)//得到一组解
{
    List<GAResult> l_gar = new List<GAResult>();
    for (int i = 0; i < quene.Length; i++)
    {
        List<CargoNum> l_cn = getCargoNumList(ct, cn, quene[i]);
        l_gar.Add(new GAResult(getProgram(ct, cn, l_cn), quene[i]));
    }
    return l_gar.ToArray();
}`,
        `public static Program HGSAA_3D(ContainerType ct, CargoNum[] cn)
{
    double initialTemperature = 500;
    double delta = 0.98;
    double finalTemperature = 10;
    double alpha = 700;
    double point = 64;
    int popnum = 70;
    int cargos_num = getCargoNum(cn);
    double[][] init_pop = getRandomCargoSort(popnum, cargos_num);

    List<GAResult[]> garesults = new List<GAResult[]>();
    GAResult bestGAR;
    List<int[]> BandWpop = new List<int[]>();
    garesults.Add(getGAResult(ct, cn, init_pop));
    double[] fit_arr = new double[popnum];
    for (int k = 0; k < popnum; k++)
    {
        fit_arr[k] = garesults[0][k].fitness;
    }
    BandWpop.Add(new int[2] { Array.IndexOf(fit_arr, garesults[0].Max(x => x.fitness)), Array.IndexOf(fit_arr, garesults[0].Min(x => x.fitness)) });
    bestGAR = garesults[0][BandWpop[0][0]];
    int MAX_exitnum = 0;
    int NC = 0;
    for (double temperature = initialTemperature; temperature > finalTemperature;)
    {
        DateTime dt1 = DateTime.Now;
        init_pop = HGSAAOperation(ct, cn, garesults, init_pop, cargos_num, BandWpop, NC, temperature, alpha);
        //更新种群状态
        NC++;
        garesults.Add(getGAResult(ct, cn, init_pop));
        for (int k = 0; k < popnum; k++)
        {
            fit_arr[k] = garesults[NC][k].fitness;
        }
        BandWpop.Add(new int[2] { Array.IndexOf(fit_arr, garesults[NC].Max(x => x.fitness)), Array.IndexOf(fit_arr, garesults[NC].Min(x => x.fitness)) });
        if (bestGAR.fitness < garesults[NC][BandWpop[NC][0]].fitness)
        {
            bestGAR = garesults[NC][BandWpop[NC][0]];
            MAX_exitnum = 0;
        }
        else MAX_exitnum++;
        if (MAX_exitnum > 50) break;
        DateTime dt2 = DateTime.Now;
        TimeSpan dd = dt2 - dt1;
        if (temperature <= point) temperature /= 10;//temperature = 15 / temperature;
        else temperature *= delta;
    }
    return bestGAR.program;
}

public static double[][] HGSAAOperation(ContainerType ct, CargoNum[] cn, List<GAResult[]> garesults, double[][] init_pop, int cargos_num, List<int[]> BandWpop, int NC, double temperature, double alpha)
{
    //交叉
    for (int i = 0; i < init_pop.Length; i++)
    {
        double[] temp_p = (double[])init_pop[i].Clone();
        double[][] temp_p3 = new double[1][];
        temp_p3[0] = temp_p;
        int r_num = new Random(Guid.NewGuid().GetHashCode()).Next(cargos_num - 1);
        if (i != BandWpop[NC][0])
        {
            for (; r_num < init_pop[i].Length; r_num++)
            {
                init_pop[i][r_num] = init_pop[BandWpop[NC][0]][r_num];
            }
            double[][] temp_p2 = new double[1][];
            temp_p2[0] = init_pop[i];
            GAResult[] temp_gar = getGAResult(ct, cn, temp_p2);
            double delta = (temp_gar[0].fitness - getGAResult(ct, cn, temp_p3)[0].fitness);
            double p = Math.Exp(delta * alpha / temperature);
            if ((double)((new Random(Guid.NewGuid().GetHashCode()).Next(100000)) / 100000) > Math.Exp((temp_gar[0].fitness - getGAResult(ct, cn, temp_p3)[0].fitness) * alpha / temperature))
                init_pop[i] = temp_p;
        }
        else
        {
            double r_num2 = (double)((new Random(Guid.NewGuid().GetHashCode()).Next(100000)) / 100000);
            init_pop[i][r_num] = r_num2;
            double[][] temp_p2 = new double[1][];
            temp_p2[0] = init_pop[i];
            GAResult[] temp_gar = getGAResult(ct, cn, temp_p2);
            //if (temp_gar[0].fitness < garesults[NC][BandWpop[NC][0]].fitness)
            if ((double)((new Random(Guid.NewGuid().GetHashCode()).Next(100000)) / 100000) > Math.Exp((temp_gar[0].fitness - getGAResult(ct, cn, temp_p3)[0].fitness) * alpha / temperature))
                init_pop[i] = temp_p;
        }
    }
    //变异
    for (int i = 0; i < init_pop.Length; i++)
    {
        double[] temp_p = (double[])init_pop[i].Clone();
        double[][] temp_p3 = new double[1][];
        temp_p3[0] = temp_p;
        int r_num1 = new Random(Guid.NewGuid().GetHashCode()).Next(cargos_num);
        for (int j = 0; j < r_num1; j++)
        {
            int r_num2 = new Random(Guid.NewGuid().GetHashCode()).Next(cargos_num - 1);
            init_pop[i][r_num2] = (double)((new Random(Guid.NewGuid().GetHashCode()).Next(100000)) / 100000);
        }
        double[][] temp_p2 = new double[1][];
        temp_p2[0] = init_pop[i];
        GAResult[] temp_gar = getGAResult(ct, cn, temp_p2);
        if (i != BandWpop[NC][0])
        {
            //if (temp_gar[0].fitness < garesults[NC][BandWpop[NC][1]].fitness)
            if ((double)((new Random(Guid.NewGuid().GetHashCode()).Next(100000)) / 100000) > Math.Exp((temp_gar[0].fitness - getGAResult(ct, cn, temp_p3)[0].fitness) * alpha / temperature))
                init_pop[i] = temp_p;
        }
        else
        {
            //if (temp_gar[0].fitness < garesults[NC][BandWpop[NC][0]].fitness)
            if ((double)((new Random(Guid.NewGuid().GetHashCode()).Next(100000)) / 100000) > Math.Exp((temp_gar[0].fitness - getGAResult(ct, cn, temp_p3)[0].fitness) * alpha / temperature))
                init_pop[i] = temp_p;
        }
    }
    return init_pop;
}`,
        `public static Program CHNN_3D(ContainerType ct, CargoNum[] cn)
{
    int cargos_num = getCargoNum(cn);
    double A = cargos_num * cargos_num, D = cargos_num / 2, u0 = 0.002, step = 0.000005;
    int NC_MAX = 900;
    List<GAResult> ga_results = new List<GAResult>();
    bool garesults_lock = false;
    List<Task> arr_task = new List<Task>();
    for (int iter = 0; iter < 40; iter++)
    {
        arr_task.Add(new Task(() => CHNN_Task(cargos_num, u0, A, step, D, ga_results, ct, cn, NC_MAX, garesults_lock)));
        arr_task[arr_task.Count - 1].Start();
    }
    Task.WaitAll(arr_task.ToArray());
    double[] arr_fit = new double[ga_results.Count];
    if (ga_results.Count == 0) return null;
    for (int i = 0; i < arr_fit.Length; i++)
    {
        arr_fit[i] = ga_results[i].fitness;
    }
    int ga_index = Array.IndexOf(arr_fit, ga_results.Max(x => x.fitness));
    return ga_results[ga_index].program;
}

public static void CHNN_Task(int cargos_num, double u0, double A, double step, double D, List<GAResult> ga_results, ContainerType ct, CargoNum[] cn, int NC_MAX, bool garesults_lock)
{
    double E = 0;
    Matrix u = Matrix.Random(cargos_num, -1, 1);
    double fitness = 0;
    Matrix U = Matrix.Zeros(cargos_num);
    for (int i = 0; i < U.Rows; i++)
    {
        for (int j = 0; j < U.Cols; j++)
        {
            U[i, j] = 0.5 * u0 * Math.Log(cargos_num - 1) + u[i, j];
        }
    }
    Matrix V = Matrix.Zeros(cargos_num);
    for (int i = 0; i < V.Rows; i++)
    {
        for (int j = 0; j < V.Cols; j++)
        {
            V[i, j] = 0.5 * (1 + Math.Tanh(U[i, j] / u0));
        }
    }
    if (getRightSolution(V) != null)
    {
        ga_results.Add(getGAResult(ct, cn, getRightSolution(V))[0]);
        fitness = 1 / ga_results[ga_results.Count - 1].fitness;
    }
    for (int NC = 0; NC < NC_MAX; NC++)
    {
        //计算dU
        Matrix dU = Matrix.Zeros(cargos_num);
        for (int i = 0; i < dU.Rows; i++)
        {
            for (int j = 0; j < dU.Cols; j++)
            {
                double row_sum = 0, col_sum = 0;
                for (int k = 0; k < dU.Cols; k++)
                {
                    row_sum += V[i, k];
                }
                for (int k = 0; k < dU.Rows; k++)
                {
                    col_sum += V[k, j];
                }
                dU[i, j] = -A * (row_sum - 1) - A * (col_sum - 1);
            }
        }
        //更新U的t+1时刻状态
        for (int i = 0; i < U.Rows; i++)
        {
            for (int j = 0; j < U.Cols; j++)
            {
                U[i, j] += (dU[i, j] * step);
            }
        }
        //更新V的t+1时刻状态
        for (int i = 0; i < V.Rows; i++)
        {
            for (int j = 0; j < V.Cols; j++)
            {
                V[i, j] = 0.5 * (1 + Math.Tanh(U[i, j] / u0));
            }
        }
        //计算能量函数E
        double E1 = 0, E2 = 0;
        for (int i = 0; i < V.Rows; i++)
        {
            double row = 0;
            for (int j = 0; j < V.Cols; j++)
            {
                row += V[i, j];
            }
            row -= 1;
            E1 += (row * row);
        }
        for (int j = 0; j < V.Cols; j++)
        {
            double col = 0;
            for (int i = 0; i < V.Rows; i++)
            {
                col += V[i, j];
            }
            col -= 1;
            E2 += (col * col);
        }
        if (getRightSolution(V) != null)
        {
            while (garesults_lock) continue;
            garesults_lock = true;
            ga_results.Add(getGAResult(ct, cn, getRightSolution(V))[0]);
            garesults_lock = false;
            fitness = 1 / ga_results[ga_results.Count - 1].fitness;
            E = (A / 2) * E1 + (A / 2) * E2 + (D / 2) * (fitness);
            break;
        }
    }
}

public static double[][] getRightSolution(Matrix V)
{
    double[][] result = new double[1][];
    result[0] = new double[V.Rows];
    Matrix solution = Matrix.Zeros(V.Rows);
    for (int j = 0; j < V.Cols; j++)
    {
        int maxindex = 0;
        for (int i = 0; i < V.Rows; i++)
        {
            if (V[maxindex, j] < V[i, j])
                maxindex = i;
        }
        solution[maxindex, j] = 1;
    }
    //判断每行是否仅有一个1
    int checknum = 1;
    for (int i = 0; i < V.Rows; i++)
    {
        double sum = 0;
        for (int j = 0; j < V.Cols; j++)
        {
            sum += solution[i, j];
        }
        if (sum != 1)
        {
            checknum = 0;
            break;
        }
    }
    if (checknum == 0)
    {
        return null;
    }
    else
    {
        for (int j = 0; j < V.Cols; j++)
        {
            for (int i = 0; i < V.Rows; i++)
            {
                if (solution[i, j] == 1)
                {
                    result[0][i] = (double)((double)j * (1 / (double)V.Rows));
                }
            }
        }
        return result;
    }
}`]
    },
    methods: {
        changeText(num) {
            switch (num) {
                case 1:
                    $(app1.show_container).animate({
                        opacity: 0
                    }, 300, 'easeInOutBounce');
                    $(app1.show_container).css("display", "none");
                    $('#intro_1').css("display", "inline");
                    $('#intro_1').animate({
                        opacity: 1
                    }, 300, 'easeInOutBounce');
                    app1.show_container = '#intro_1';
                    $('.btn_code').css('right', '-100px');
                    break;
                case 2:
                    $(app1.show_container).animate({
                        opacity: 0
                    }, 300, 'easeInOutBounce');
                    $(app1.show_container).css("display", "none");
                    $('#intro_2').css("display", "inline");
                    $('#intro_2').animate({
                        opacity: 1
                    }, 300, 'easeInOutBounce');
                    app1.show_container = '#intro_2';
                    $('.btn_code').css('right', '0');
                    break;
                case 3:
                    $(app1.show_container).animate({
                        opacity: 0
                    }, 300, 'easeInOutBounce');
                    $(app1.show_container).css("display", "none");
                    $('#intro_3').css("display", "inline");
                    $('#intro_3').animate({
                        opacity: 1
                    }, 300, 'easeInOutBounce');
                    app1.show_container = '#intro_3';
                    $('.btn_code').css('right', '0');
                    break;
                case 4:
                    $(app1.show_container).animate({
                        opacity: 0
                    }, 300, 'easeInOutBounce');
                    $(app1.show_container).css("display", "none");
                    $('#intro_4').css("display", "inline");
                    $('#intro_4').animate({
                        opacity: 1
                    }, 300, 'easeInOutBounce');
                    app1.show_container = '#intro_4';
                    $('.btn_code').css('right', '0');
                    break;
                case 5:
                    $(app1.show_container).animate({
                        opacity: 0
                    }, 300, 'easeInOutBounce');
                    $(app1.show_container).css("display", "none");
                    $('#intro_5').css("display", "inline");
                    $('#intro_5').animate({
                        opacity: 1
                    }, 300, 'easeInOutBounce');
                    app1.show_container = '#intro_5';
                    $('.btn_code').css('right', '0');
                    break;
            }
        },
        codeChoose() {
            switch (app1.show_container) {
                case '#intro_2':
                    $('#code_2').offCanvas({ effect: 'push' });
                    $('#code_2').offCanvas('open');
                    break;
                case '#intro_3':
                    $('#code_3').offCanvas({ effect: 'push' });
                    $('#code_3').offCanvas('open');
                    break;
                case '#intro_4':
                    $('#code_4').offCanvas({ effect: 'push' });
                    $('#code_4').offCanvas('open');
                    break;
                case '#intro_5':
                    $('#code_5').offCanvas({ effect: 'push' });
                    $('#code_5').offCanvas('open');
                    break;
            }
        }
    }
});

$(function () {
    var h1 = $('#main2').height();
    var h2 = $('.footer').height();
    $('#main1').height($(window).height() - h1 - h2 - 10);
    $('.btn_code').hover(function () {
        $('.code_btn_icon').addClass('code_btn_icon_show');
    }, function () {
        $('.code_btn_icon').removeClass('code_btn_icon_show');
        });
    $('pre').height(($(window).height() - $('.code_title').height()) * 0.82);
});
$(window).resize(function () {
    var h1 = $('#main2').height();
    var h2 = $('.footer').height();
    $('#main1').height($(window).height() - h1 - h2 - 10);
    $('pre').height($(window).height()*0.82);
});