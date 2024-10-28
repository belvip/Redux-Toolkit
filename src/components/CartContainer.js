import React from 'react';
import CartItem from './CartItem';
import { useSelector } from 'react-redux';
import cartItems from '../cartItems';

const CartContainer = () => {
    const {cartItem,total,amount} = useSelector((store) => store.cart);

    if(amount < 1){
        return (
            <section className='cart'>
                <header>
                    <h2>your bag</h2>
                    <h4 className='empty-cart'>is currently empty</h4>
                </header>
            </section>
        );
    }
    return (
        <section className='cart'>
            <h2>your bag</h2>
            <div>
                {cartItems.map((item) => {
                    return <CartItem key={item.id} {...item}/>
                })}
            </div>
            <footer>
                <hr />
                <div className="cart-total">
                    <h4>total <span>{total}xaf</span></h4>
                </div>
                
            </footer>
            <button className="btn clear-btn">clear cart</button>
        </section>
    )
}

export default CartContainer