# Combing Context and Custom Hooks

Combining context and custom hooks is a powerful way to manage state in your application. This pattern allows you to create a custom hook that can be used to access the context and state in a more readable and reusable way.

## React Setup

First we are going to assume that you have a react app created already. This could be done using a Vite SPA template, or by using a framework like Next.js or Gatsby.

## Create the Hook

We will get started by creating a new custom hook (usually I create a `hooks` directory and place them all there) to contain our logic. This hook will be used to access the context and state.

```jsx:line-numbers [useCounter.js]
import { createContext, useContext, useState } from 'react';

const CounterContext = createContext();

export const CounterProvider = ({ children }) => {
    const [count, setCount] = useState(0);

    const increaseCount = () => setCount(count + 1);
    const decreaseCount = () => setCount(count - 1);

    const context = {
        count,
        increaseCount,
        decreaseCount
    };
    
    return (
        <CounterContext.Provider value={context}>
            {children}
        </CounterContext.Provider>
    );
}

export const useCounter = () => {
    const context = useContext(CounterContext);

    if (context === undefined) {
        throw new Error('useCounter must be used within a CounterProvider');
    }

    return context;
};
```

Lets go through this and explain it. First we create our Context using `const CounterContext = createContext();`. This will allow us to store our state and methods in a single place, to access anywhere in our app (assuming we have a `CounterProvider` wrapping our app).

Next we create our `CounterProvider` component. This will be used to wrap our app and provide the context to our custom hook. We use `useState` to create a `count` state and `setCount` method. We also create `increaseCount` and `decreaseCount` methods to update the `count` state. We will then create our context value, which is simply the output data we need (`count`), and the methods we can use to interact with and update it (`increaseCount` and `decreaseCount`).

Finally we create our `useCounter` custom hook. This hook will be used to access the context and state in a more readable and reusable way. We use `useContext` to access the context, and then check if the context is `undefined`, which will only be the case if the hook is being used outside of the provider.

## Using the Hook

Now that we have our custom hook, we can use it in our app to access the same context and state in different components. See below for some sample usage, in this example the buttons and couter have been separated into their own components.

::: code-group

```jsx:line-numbers [components/Buttons.js]
import { useCounter } from "../hooks/useCounter";

const Buttons = () => {
    const { increaseCount, decreaseCount } = useCounter();

    return (
        <div>
            <button onClick={increaseCount}>Increase Count +</button>
            <button onClick={decreaseCount} >Decrease Count -</button>
        </div>
    );
};

export default Buttons;
```

```jsx:line-numbers [components/Count.js]
import { useCounter } from "../hooks/useCounter";

const Count = () => {
    const { count } = useCounter();

    return (
        <div>
            <h1>Count: {count}</h1>
        </div>
    );
}

export default Count;
```

```jsx:line-numbers [App.js]
import './App.css';
import { CounterProvider } from './hooks/useCounter';
import Buttons from './components/Buttons';
import Count from './components/Count';

function App() {
  return (
    <>
    <CounterProvider>
    <div className="App">
      <header className="App-header">
        <Buttons />
        <Count />
      </header>
    </div>
    </CounterProvider>
    </>
  );
}

export default App;
```

:::

When the above app is run and the buttons are clicked, the count will increase and decrease, and the `Count` component will update to reflect the new count.

## Conclusion

Combining context and custom hooks is a really powerful way to manage state in your application. Often using TypeScript can help to make this pattern even more powerful, as you can define the shape of the context and state, and ensure that the correct data is being passed around your app.

You can also do all your data fetching and API calls in the custom hook, and then pass the data to the context, which can then be accessed by any component in your app. This is a great way to manage your state and data in a more readable and reusable way.