import { useContext, useEffect } from "react";
import CartContext from "../../Context/CartContext";

function BookCart({
  onRemoveCartItem = (bookId: any) => {},
  onBorrowBook = () => {},
}) {
  const { cart } = useContext(CartContext);

  useEffect(() => {}, [cart]);

  return (
    <div>
      {cart &&
        cart.length > 0 &&
        cart.map((item: any, index: any) => (
          <div key={index}>
            <div>Name: {item.name}</div>
            {/* <div>{item.category.name}</div> */}
            <div>Author: {item.author}</div>
            <div onClick={() => onRemoveCartItem(item.id)}>
              <button>Remove</button>
            </div>
          </div>
        ))}
      <div>
        <button onClick={onBorrowBook}>Borrow book</button>
      </div>
    </div>
  );
}

export default BookCart;
