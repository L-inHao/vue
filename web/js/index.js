new Vue({
    el:'.container',
    data:{
        //添加数据表单
        name:'',
        age:'',
        content:'',
        //数据列表
        msgList:[],
        //修改表单
        editId:-1,
        editName:'',
        editAge:'',
        editContent:'',
        //总页数
        pageCount:0,
        //当前页
        curPage:1,
        //修改弹层
        editPanel:false,
        //遮罩层
        isShadow:false,
        //删除ID
        delId:-1
    },
    methods:{
        //添加
        addMsg(){
            $.ajax({
                url:'/addBBS',
                data:{
                    truename:encodeURIComponent(this.name),
                    age:this.age,
                    content:encodeURIComponent(this.content)
                },
                dataType:'json',
                type:'POST'
            }).then(res=>{
                console.log(res);
                if(res.err){
                    //失败了，err=1
                    alert('发布失败！因为：'+res.msg);
                }else{
                    alert('亲，恭喜您，发布成功了！');
                    //清空表单
                    this.name = '';
                    this.age = '';
                    this.content = '';
                    //重新展示第1页数据
                    this.getPageMsg(1);
                }
            },err=>{
                alert('接口出错了！');
            });
        },
        //查询所有
        getAll(){
            $.getJSON('/getAllBBS').then(r=>{
                if(r.err){
                    alert('出错了,因为：'+r.msg);
                }else{
                    //console.log(r.data);
                    this.msgList = r.data;
                }
            },err=>{
                alert('出错了！');
            });
        },
        //查询一页数据
        getPageMsg(page=1){
            //let page = p || 1;
            this.curPage = page;
            let _this = this;
            $.ajax({
                url:'/getPageData',
                data:{
                    page
                },
                dataType:'json'
            }).then(function(r){
                //console.log(r);
                if(r.err){
                    alert('服务器返回错误：'+r.msg);
                }else{
                    if(r.data.length==0 && _this.curPage>1){
                        _this.getPageMsg(page-1);
                    }
                    _this.msgList = r.data;
                    //console.log(this.msgList);
                    //获取页数
                    _this.getPageCount();

                }
            },err=>{
                alert('出错了');
            });
        },
        //获取所有页数
        getPageCount(){
            $.get('/getPageCount',r=>{
                //alert(typeof r);
                this.pageCount = r.count;
            });
        },
        //上一页
        prePage(){
            this.curPage--;
            if(this.curPage == 0){
                this.curPage = 1;
            }else{
                this.getPageMsg(this.curPage);
            }

        },
        //下一页
        nextPage(){
            this.curPage++;
            if(this.curPage > this.pageCount){
                this.curPage = this.pageCount;
            }else{
                this.getPageMsg(this.curPage);
            }

        },
        //修改
        edit(id){
            //id  msgList
            let item = this.msgList.filter(x=>x.id==id);
            this.editId = id;
            this.editName = item[0].name;
            this.editAge = item[0].age;
            this.editContent = item[0].content;

            this.editPanel = true;
            this.isShadow = true;
        },
        //保存修改
        editOK(){
            $.ajax({
                url:'/saveEdit',
                type:'POST',
                data:{
                    id:this.editId,
                    name:encodeURIComponent(this.editName),
                    age:this.editAge,
                    content:encodeURIComponent(this.editContent)
                },
                dataType:'json'
            }).then(r=>{
                if(r.err){
                    alert('修改失败！');
                }else{
                    alert('修改成功');
                    this.editPanel = false;
                    this.isShadow = false;

                    let editItem = this.msgList.filter(x=>x.id==this.editId)[0];


                    editItem.name = this.editName;
                    editItem.age = this.editAge;
                    editItem.content = this.editContent;
                }

                //console.log(r);
            },err=>{
                alert('出错了');
            });



        },
        //确认删除
        delOK(){
            $.getJSON('/del',{id:this.delId},r=>{
                if(r.err){
                    alert('删除失败！');
                }else{
                    $('.delPanel').modal('hide');
                    this.getPageMsg(this.curPage);
                }
            });
        }

    },
    //mounted:function(){}
    mounted(){
        //挂载完成后的钩子
        this.getPageMsg();
    }
});

//vm.getPageMsg(2);










