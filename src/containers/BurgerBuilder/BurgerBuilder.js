import React, { Component } from 'react'
import Aux from '../../hoc/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

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
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 4,
    purchasable: false,
    purchasing: false
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

    // const oldCount = this.state.ingredients[type]
    // const updatedCount = oldCount + 1
    // const updatedIngredients = {
    //   ...this.state.ingredients
    // }
    // updatedIngredients[type] = updatedCount
    // const priceAddition = INGREDIENT_PRICE[type]
    // const oldPrice = this.state.totalPrice
    // const newPrice = oldPrice + priceAddition

    // this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
  }
  removeIngredientHandler = (type) => {
    this.helper(type, 'minus')

    // const oldCount = this.state.ingredients[type]
    // const updatedCount = oldCount - 1
    // const updatedIngredients = {
    //   ...this.state.ingredients
    // }
    // updatedIngredients[type] = updatedCount
    // const priceAddition = INGREDIENT_PRICE[type]
    // const oldPrice = this.state.totalPrice
    // const newPrice = oldPrice - priceAddition

    // this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
  }
  purchageHandler() {
    this.setState({ purchasing: true })
  }
  purchageCancelHandler = () => {
    this.setState({ purchasing: false })
  }
  purchageContinueHandler = () => {
    alert('You continue!')
  }
  render() {
    const disabledInfo = {
      ...this.state.ingredients
    }
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchageCancelHandler}
        >
          <OrderSummary
            ingredients={this.state.ingredients}
            purchageCancelled={this.purchageCancelHandler}
            purchageContinue={this.purchageContinueHandler}
            price={this.state.totalPrice}
          />
        </Modal>
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
  }
}

export default BurgerBuilder
