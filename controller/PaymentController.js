import "dotenv/config";
import Stripe from "stripe";
import Payment from "../model/Payment.js";
import { payingUser } from "../store/Paying.js";
import User from "../model/User.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(
  `${process.env.STRIPE_PRIVATE_KEY}`
);

// export const getPayment = async (r)

export const createPayment = async (req, res) => {
  const order = req.body;
  console.log(order);
  payingUser.plan = order.plan;
  payingUser.user_id = order.user_id;
  payingUser.site = order.site;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: order.plan,
            },
            unit_amount: Math.max(parseInt(1 * 100), 50),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.LINK_DEV}/success`,
      cancel_url: `${process.env.LINK_DEV}/`,
    });
    const payment = await Payment.create({
      user_id: order.user_id,
      plan: order.plan,
      amount: 10,
      paid: true,
    });

    await payment.save();
    res.json({ url: session.url }).status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const success = async (req, res) => {
  try {
    const data = {
      user_id: payingUser.user_id,
      amount: req.query.amount_total,
      plan: payingUser.plan,
    };
    const user = await User.findOne({ _id: data.user_id });
    if (!user) {
      res.json({ message: "User not found" });
    }

    let requests;
    switch (user.plan) {
      case "free":
        requests = 10;
        break;
      case "subscription-1":
        requests = 20;
        break;
      case "subscription-2":
        requests = 30;
        break;
      case "subscription-3":
        requests = 40;
        break;

      default:
        requests = 10;
        break;
    }

    //update the user details in the db
    user.plan = data.plan;
    user.requests = user.requests + requests
    await user.save();

    //insert the payment info in the
    const payment = await Payment.create(data);

    //redirecting the user to the dashboard
    setTimeout(() => {
      res.redirect(303, `${process.env.LINK_DEV}/success`);
    }, 3000);
  } catch (error) {
    console.error(error);
    res.json({ error: error }).status(500);
  }
};

export const cancel = async (req, res) => {
  //redirect to the dashboard
  res.redirect(303, `${process.env.LINK_DEV}failure`);
};
