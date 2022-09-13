import request from "@/utils/request";


/* 
*组织部门查询接口
*
*/

export function getDepartments() {
    return request({
        url: "/company/department",
        method: "GET",
    });
}

/*
*组织部门删除接口
*
*/

export function delDepartments(id) {
    return request({
        url: `/company/department/${id}`,
        method: "DELETE",
    });
}

/*
*新增部门接口
*
*/
export function addDepartments(data) {
    return request({
        url: '/company/department',
        method: "POST",
        data  //axios的body参数放在data里
    });
}


/*
*根据id修改部门数据
*
*/
export function updateDepartments(data) {
    return request({
        url: `/company/department/${data.id}`,
        method: "PUT",
        data
    });
}


/*
*根据id获取部门详情
*
*/
export function getDepartDetail(id) {
    return request({
        url: `/company/department/${id}`,
        method: "GET",
    });
}



