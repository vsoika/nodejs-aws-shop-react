import Typography from "@mui/material/Typography";
import { Product } from "~/models/Product";
import CartIcon from "@mui/icons-material/ShoppingCart";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { useCart, useInvalidateCart, useUpsertCart } from "~/queries/cart";
import { useCallback } from "react";

type AddProductToCartProps = {
  product: Product;
};

export default function AddProductToCart({ product }: AddProductToCartProps) {
  const { data = [], isFetching } = useCart();
  const { mutate: upsertCart } = useUpsertCart();
  const invalidateCart = useInvalidateCart();
  const cartItem = data.find((i) => i.product.id === product.id);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageUrl, ...restProductData } = product;

  const addProduct = useCallback(() => {
    upsertCart(
      { product: restProductData, count: cartItem ? cartItem.count + 1 : 1 },
      { onSuccess: invalidateCart }
    );
  }, [restProductData, cartItem]);

  const removeProduct = useCallback(() => {
    if (cartItem && cartItem.count !== 0) {
      upsertCart(
        { ...cartItem, count: cartItem.count - 1 },
        { onSuccess: invalidateCart }
      );
    }
  }, [cartItem]);

  return cartItem ? (
    <>
      <IconButton disabled={isFetching} onClick={removeProduct} size="large">
        <Remove color={"secondary"} />
      </IconButton>
      <Typography align="center">{cartItem.count}</Typography>
      <IconButton disabled={isFetching} onClick={addProduct} size="large">
        <Add color={"secondary"} />
      </IconButton>
    </>
  ) : (
    <IconButton disabled={isFetching} onClick={addProduct} size="large">
      <CartIcon color={"secondary"} />
    </IconButton>
  );
}
