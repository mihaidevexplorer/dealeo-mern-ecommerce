// src/utiles/queryProducts.ts - VERSIUNEA ACTUALIZATĂ

// Interfață pentru un produs
interface Product {
    _id?: string | any;
    name: string;
    price: number;
    category: string;
    rating: number;
    [key: string]: any; // Permite proprietăți suplimentare pe produse
}

// Interfață pentru opțiunile de interogare - ACTUALIZATĂ
interface QueryOptions {
    category?: string;
    rating?: string;
    searchValue?: string;
    lowPrice?: number;  // Schimbat de la string la number
    highPrice?: number; // Schimbat de la string la number
    sortPrice?: 'low-to-high' | 'high-to-low' | string; // Union type mai flexibil
    pageNumber?: string;
    parPage: number;
    [key: string]: any; // Permite opțiuni suplimentare de interogare
}

class QueryProducts {
    private products: Product[];
    private query: QueryOptions;

    constructor(products: Product[], query: QueryOptions) {
        this.products = products;
        this.query = query;
    }

    categoryQuery = (): QueryProducts => {
        this.products = this.query.category 
            ? this.products.filter(c => c.category === this.query.category) 
            : this.products;
        return this;
    }

    ratingQuery = (): QueryProducts => {
        this.products = this.query.rating 
            ? this.products.filter(c => {
                const ratingValue = parseInt(this.query.rating as string);
                return ratingValue <= c.rating && c.rating < ratingValue + 1;
              }) 
            : this.products;
        return this;
    }

    searchQuery = (): QueryProducts => {
        this.products = this.query.searchValue 
            ? this.products.filter(p => 
                p.name.toUpperCase().indexOf(this.query.searchValue!.toUpperCase()) > -1) 
            : this.products;
        return this;
    }

    priceQuery = (): QueryProducts => {
        // Folosim valorile numerice pentru filtrare
        const lowPrice = this.query.lowPrice || 0;
        const highPrice = this.query.highPrice || Number.MAX_VALUE;
        
        this.products = this.products.filter(p => 
            p.price >= lowPrice && p.price <= highPrice);
        return this;
    }

    sortByPrice = (): QueryProducts => {
        if (this.query.sortPrice) {
            if (this.query.sortPrice === 'low-to-high') {
                this.products = this.products.sort((a, b) => a.price - b.price);
            } else if (this.query.sortPrice === 'high-to-low') {
                this.products = this.products.sort((a, b) => b.price - a.price);
            }
        }
        return this;
    }

    skip = (): QueryProducts => {
        const pageNumber = parseInt(this.query.pageNumber || '1');
        const skipPage = (pageNumber - 1) * this.query.parPage;
        let skipProduct: Product[] = [];

        for (let i = skipPage; i < this.products.length; i++) {
            skipProduct.push(this.products[i]);
        }
        this.products = skipProduct;
        return this;
    }

    limit = (): QueryProducts => {
        let temp: Product[] = [];
        if (this.products.length > this.query.parPage) {
            for (let i = 0; i < this.query.parPage; i++) {
                temp.push(this.products[i]);
            } 
        } else {
            temp = this.products;
        }
        this.products = temp;
        return this;
    }

    getProducts = (): Product[] => {
        return this.products;
    }

    countProducts = (): number => {
        return this.products.length;
    }
}

export default QueryProducts;