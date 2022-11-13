import { AddIcon, CalendarIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Button, Center, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SingleCart } from "../Components/SingleCart";
import { getproductsuccess, resetcartbag } from "../Redux/action";
import "./Cartpage.css";
import Swal from "sweetalert2";
import { Navbar } from "../Components/Navbar";
import { Footer } from "../Components/Footer";
let styles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const Cartpage = () => {
  let data = useSelector((s) => s.products);
  let [state, setstate] = useState(0);
  let [coupons, setcoupons] = useState(0);
  let [total, settotal] = useState(0);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  let sumProduct = () => {
    if (data.filter((e) => e.cartquantity > 0) == 0) {
      settotal(0);
    } else {
      let sum = 0;
      let arrs = data
        .filter((e) => e.cartquantity > 0)
        .forEach((e) => (sum += e.price * e.cartquantity));
      settotal(sum);
    }
  };
  let handlecoupons = () => {
    setcoupons(30);
  };
  let handlecheakout = () => {
    data
      .filter((e) => e.cartquantity > 0)
      .forEach((e) => dispatch(resetcartbag(e.id)));
    setstate((prev) => prev + 1);
    Swal.fire({
      title: "Order Placed Succesfully !!",
      text: "Thankyou For Shoping",
      type: "success",
    });
    scrollTop();
    navigate("/");
  };

  useEffect(() => {
    sumProduct();
    let url = `https://sepia-mercurial-novel.glitch.me/api/products`;
    let datapack = [url];
    dispatch(getproductsuccess(datapack));
  }, [total, state]);

  useEffect(() => {
    sumProduct();
    return () => {
      sumProduct();
    };
  }, [sumProduct]);

  return (
    <>
      <Navbar />
      <div className="Product-Cart-Heading">
        <h1 className="Product-Cart-header-h1">Shopping Cart</h1>
        <Alert status="info">
          <img src="/Image/ship-free.png" width="40px" />
          &nbsp;&nbsp;&nbsp; Yay! No convenience fee on this order.
        </Alert>
        <br />
      </div>
      <div className="Product-Cart-main">
        <div className="Product-Cart-left">
          {data
            .filter((e) => e.cartquantity > 0)
            .map((arr, i) => (
              <SingleCart arr={arr} setstate={setstate} />
            ))}
          {data.filter((e) => e.cartquantity > 0).length == 0 ? (
            <>
              <img src="/Image/emptycart.jpg" />
              <br />
              <Center>
                <Link to="/body-care">
                  <Button colorScheme="red">BACK TO PRODUCT PAGE</Button>
                </Link>
              </Center>
            </>
          ) : (
            false
          )}
        </div>
        <div className="Product-Cart-right">
          <div>
            <label>Coupons</label>
            <br />
            <hr />
            <br />
            <div style={styles}>
              <CalendarIcon />
              <Text fontSize="md"> Apply Coupons</Text>
              <Button
                disabled={coupons > 0 || total == 0}
                onClick={handlecoupons}
                size="sm"
                colorScheme="red"
              >
                {coupons > 0 ? "Applied" : "Apply"}
              </Button>
            </div>
            <br />
            {coupons > 0 ? (
              <Alert status="success">
                <AlertIcon />
                Flat -₹30 Coupon Applied !!
              </Alert>
            ) : (
              <Text color="red" textAlign="center" fontSize="md">
                Get Upto 50% OFF
              </Text>
            )}
          </div>
          <br />
          <div>
            <label>Gifting & Personalization</label>
            <br />
            <hr />
            <br />
            <img src="/Image/gift.jpg" alt="xcvb" />
          </div>
          <br />
          <div>
            <label>Price Details</label>
            <br />
            <hr />
            <br />
            <div style={styles}>
              <label>Total MRP</label>
              <label>₹{total.toFixed(2)}</label>
            </div>
            <div style={styles}>
              <label>Total Discount MRP</label>
              <label>-₹{(total / 10).toFixed(2)}</label>
            </div>
            <div style={styles}>
              <label>Coupos DisCount</label>
              <label>-₹{coupons}</label>
            </div>
            <div style={styles}>
              <label>
                Convenience Fee <span style={{ color: "red" }}>Know more</span>
              </label>
              <label>
                <Text as="s">₹99</Text>{" "}
                <span style={{ color: "red" }}>FREE</span>
              </label>
            </div>
            <hr />
            <div style={styles}>
              <label>Total Amount</label>
              <label>₹{(total - total / 10 - coupons).toFixed(2)}</label>
            </div>
            <br />
            <Center>
              <Button
                disabled={total == 0}
                onClick={handlecheakout}
                colorScheme="teal"
              >
                PROCEED TO CHECKOUT
              </Button>
            </Center>
            <br />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
