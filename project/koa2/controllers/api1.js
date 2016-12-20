/**
 * Created by zhang on 2016/12/20.
 */

var products = [{
    name:"iphone",
    price:900
},{
    name:"kindle",
    price:100
}];

module.exports = {
    'GET /api/products':async(ctx,next) => {
        ctx.response.type = 'application/json';
        ctx.response.body = {
            products:products
        }
    },

    'POST /api/products':async(ctx,next) => {
        var p = {
            name:ctx.request.body.name,
            price:ctx.request.body.price
        };
        products.push(p);
        ctx.response.type = 'application/json';
        ctx.response.body = p;
    }
};
//curl -H 'Content-Type: application/json' -X POST -d '{"name":"XBox","price":3999}'
