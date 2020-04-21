import React, { Component } from 'react'
import Aux from '../../hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'

const INGREDIENT_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  constructor(props) {
    super(props)
    this.updatedCount = 0
    this.newPrice = 0
  }
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }
  componentDidMount() {
    axios
      .get(
        'https://react-burger-builders-e9a57.firebaseio.com/ingredients.json'
      )
      .then((response) => {
        this.setState({ ingredients: response.data })
      })
      .catch((error) => {
        this.setState({ error: true })
      })
  }
  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey]
      })
      .reduce((sum, el) => {
        return sum + el
      }, 0)
    this.setState({ purchasable: sum > 0 })
  }
  helper(type, mode) {
    const oldCount = this.state.ingredients[type]
    if (mode === 'minus' && oldCount <= 0) {
      return
    }
    if (mode === 'plus') {
      this.updatedCount = oldCount + 1
    }
    if (mode === 'minus') {
      this.updatedCount = oldCount - 1
    }

    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = this.updatedCount
    const priceAddition = INGREDIENT_PRICE[type]
    const oldPrice = this.state.totalPrice
    if (mode === 'plus') {
      this.newPrice = oldPrice + priceAddition
    }
    if (mode === 'minus') {
      this.newPrice = oldPrice - priceAddition
    }

    this.setState({
      totalPrice: this.newPrice,
      ingredients: updatedIngredients
    })
    this.updatePurchaseState(updatedIngredients)
  }
  addIngredientHandler = (type) => {
    this.helper(type, 'plus')
  }
  removeIngredientHandler = (type) => {
    this.helper(type, 'minus')
  }
  purchageHandler() {
    this.setState({ purchasing: true })
  }
  purchageCancelHandler = () => {
    this.setState({ purchasing: false })
  }
  purchageContinueHandler = () => {
    this.setState({ loading: true })
    //alert('You continue!')
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Md Moniru Islam',
        address: {
          street: 'Ka 26',
          zipCode: '1219',
          country: 'Bangladesh'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    }
    axios
      .post('/orders.json', order)
      .then((res) => this.setState({ loading: false, purchasing: false }))
      .catch((er) => this.setState({ loading: false, purchasing: false }))
  }
  render() {
    const disabledInfo = {
      ...this.state.ingredients
    }
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null

    let burger = this.state.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    )
    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientRemove={this.removeIngredientHandler}
            ingredientAdded={this.addIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            price={this.state.totalPrice}
            ordered={this.purchageHandler.bind(this)}
          />
        </Aux>
      )
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          purchageCancelled={this.purchageCancelHandler}
          purchageContinue={this.purchageContinueHandler}
          price={this.state.totalPrice}
        />
      )
    }
    if (this.state.loading) {
      orderSummary = <Spinner />
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchageCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axios)
