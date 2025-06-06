//src/components/products/Products.jsx
import PropTypes from 'prop-types';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css' 
import { IoIosArrowBack,IoIosArrowForward } from "react-icons/io";
  
const Products = ({title,products}) => {
    
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        },
    }

    const ButtonGroup = ({next,previous}) => {
        return (
            <div className='flex justify-between items-center'>
                <div className='text-xl font-bold text-gray-800'> {title} </div>
                <div className='flex justify-center items-center gap-3 text-gray-900'>
                    <button onClick={()=>previous()} className='w-[30px] h-[30px] flex justify-center items-center bg-gray-300 border border-gray-200'>
                        <IoIosArrowBack />
                    </button>
                    <button onClick={()=>next()} className='w-[30px] h-[30px] flex justify-center items-center bg-gray-300 border border-gray-200'>
                    <IoIosArrowForward /> 

                    </button>
                </div>

            </div>
        )

    }


ButtonGroup.propTypes = {
    next: PropTypes.func.isRequired,
    previous: PropTypes.func.isRequired,
};


    return (
        <div className='flex gap-8 flex-col-reverse'>
            <Carousel
                    autoPlay={false}
                    infinite={false}
                    arrows={false} 
                    responsive={responsive}
                    transitionDuration={500}
                    renderButtonGroupOutside={true}
                    customButtonGroup={<ButtonGroup next={() => {}} previous={() => {}} />}
                >
       {
        products.map((p,i)=> {
            return(
                <div key={i} className='flex flex-col justify-start gap-2'>
               {
                p.map((pl, j) =>  <Link key={j} className='flex justify-start items-start' to={`/product/details/${pl.slug}`}>
                <img className='w-[110px] h-[110px]' src={pl.images[0]} alt="" />
                <div className='px-3 flex justify-start items-start gap-1 flex-col text-gray-900'>
                    <h2>{pl.name} </h2>
                    <span className='text-lg font-bold'>${pl.price}</span> 
                </div>  
            </Link>
                 )
               }
            </div>   
            )
        })
       }         
                
                </Carousel>   
        </div>
    );
};

Products.propTypes = {
    title: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.shape({
                slug: PropTypes.string.isRequired,
                images: PropTypes.arrayOf(PropTypes.string).isRequired,
                name: PropTypes.string.isRequired,
                price: PropTypes.number.isRequired
            })
        )
    ).isRequired
};


export default Products;
