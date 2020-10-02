import Api from '@/services/Api'
export default {
    index(search) {
        return Api().get('products', {
            params: {
                search: search
            }
        })
    },
    show(productId) {
        return Api().get('product/' + productId)
    },
    post(product) {
        return Api().post('product', product)
    },
    put(product) {
        return Api().put('product/' + product.id, product)
    },
    delete(product) {
        return Api().delete('product/' + product.id, product)
    },
    frontIndex(search) {
        return Api().get('products/front', {
            params: {
                search: search
            }
        })
    },
}