import React, { Component } from "react";
import { connect } from "react-redux";

import Aux from "../../hoc/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import * as burgerBuilderActions from "../../store/actions/index";

class BurgerBuilder extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }

  state = {
    //purchasable: false,
    purchasing: false
    //loading: false,
    //error: false
  };

  componentDidMount() {
    this.props.onInitIngredients();
    // axios
    //   .get("https://react-my-burger-1da9d.firebaseio.com/ingredients.json")
    //   .then(response => {
    //     this.setState({ ingredients: response.data });
    //   })
    //   .catch(error => {
    //     this.setState({ error: true });
    //   });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    // this.setState({ purchasable: sum > 0 });
    return sum > 0;
  }

  // addIngredientHandler = type => {
  //   const oldCount = this.state.ingredients[type];
  //   const updatedCount = oldCount + 1;
  //   const updatedIngredients = {
  //     ...this.state.ingredients
  //   };
  //   updatedIngredients[type] = updatedCount;
  //   const priceAddition = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice + priceAddition;
  //   this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
  //   this.updatePurchaseState(updatedIngredients);
  // };

  // removeIngredientHandler = type => {
  //   const oldCount = this.state.ingredients[type];
  //   if (oldCount <= 0) {
  //     return;
  //   }
  //   const updatedCount = oldCount - 1;
  //   const updatedIngredients = {
  //     ...this.state.ingredients
  //   };
  //   updatedIngredients[type] = updatedCount;
  //   const priceDeduction = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice - priceDeduction;
  //   this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
  //   this.updatePurchaseState(updatedIngredients);
  // };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseContinuedHandler = () => {
    //alert("You continue");
    // const queryParams = [];
    // for (let i in this.state.ingredients) {
    //   queryParams.push(
    //     encodeURIComponent(i) +
    //       "=" +
    //       encodeURIComponent(this.state.ingredients[i])
    //   );
    // }
    // queryParams.push("price=" + this.props.price);
    // const queryString = queryParams.join("&");
    // this.props.history.push({
    //   pathname: "/checkout",
    //   search: "?" + queryString
    // });
    this.props.onInitPurchase();

    this.props.history.push("/checkout");
  };

  modalCloseHandler = () => {
    this.setState({ purchasing: false });
  };

  render() {
    const disabledInfo = {
      ...this.props.ings
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;

    let burger = this.props.error ? <p>Something went wrong</p> : <Spinner />;
    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={this.props.price}
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          price={this.props.price}
          ingredients={this.props.ings}
          purchaseCancel={this.modalCloseHandler}
          purchaseContinue={this.purchaseContinuedHandler}
        />
      );
    }

    // if (this.state.loading) {
    //   orderSummary = <Spinner />;
    // }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClose={this.modalCloseHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName =>
      dispatch(burgerBuilderActions.addIngredient(ingName)),
    onIngredientRemoved: ingName =>
      dispatch(burgerBuilderActions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(burgerBuilderActions.initIngredient()),
    onInitPurchase: () => dispatch(burgerBuilderActions.purchaseInit())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
