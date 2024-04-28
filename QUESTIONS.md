# Deel Questionnaire and Answers

Please answer the following questions to the best of your knowledge, in clear English. Elaborate and demonstrate the React knowledge you have. Feel free to give examples and use cases.

## Question 1

### Q. What is the difference between Component and PureComponent? Give an example where it might break my app

In React, Component and PureComponent are both base classes which can be imported from the `react` package for creating React components but they have a different in the way they handle updates or component re-renders.

- **Component**: The `Component` class is the base class for all React components which implements the `shouldComponentUpdate` lifecycle method by default and always returns `true`. This means that every time the component receives new props or state, it will re-render regardless of whether the new props or state are the same as the previous ones. This can lead to unnecessary re-renders and performance issues in the application.

- **PureComponent**: The `PureComponent` class is a subclass of the `Component` class which implements the `shouldComponentUpdate` lifecycle method witha shallow prop and state comparison. This means that if the new props and state are shallowly equal to the previous props and state, the component will not re-render. This can help optimize the performance of the application by preventing unnecessary re-renders when the props and state have not changed

It's important to note that this optimization relies on shallow comparisons and may not be suitable for all use cases, especially when dealing with complex data structures or nested objects where shallow comparisons may not accurately detect changes.

Let's consider a scenario involving a user profile component that displays user information.

**Scenario 1**: Using Component

```jsx
import React, { Component } from 'react';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        profilePicture: 'https://placehold.co/50x50',
      },
    };
  }

  handleUpdateProfile = () => {
    const { user } = this.state;
    user.name = 'Cane Doe'; // Mutating the user object
    this.setState({ user }); // Updating state with the mutated user object
  };

  render() {
    console.log('Name - ', this.state.user.name);
    const { name, email, profilePicture } = this.state.user;
    return (
      <div>
        <h2>User Profile</h2>
        <img src={profilePicture} alt="Profile" />
        <p>Name: {name}</p>
        <p>Email: {email}</p>

        <button onClick={this.handleUpdateProfile}>Click me</button>
      </div>
    );
  }
}

export default UserProfile;
```

In the above example, the `UserProfile` component is a class component that extends the Component class. The component has a state object that contains user information such as name, email, and profile picture. The `handleUpdateProfile` method mutates the user object directly and then calls `setState` with the mutated user object. This will trigger a re-render of the component even though the user object has not changed in terms of reference.

**Scenario 2**: Using PureComponent

```jsx
import React, { PureComponent } from 'react';

class UserProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        profilePicture: 'https://placehold.co/50x50',
      },
    };
  }

  handleUpdateProfile = () => {
    const { user } = this.state;
    const updatedUser = { ...user, name: 'Mane Doe' }; // Create a new object with the updated name
    this.setState({ user: updatedUser }); // Update state with the new user object
  };

  render() {
    console.log('Name - ', this.state.user.name);
    const { name, email, profilePicture } = this.state.user;
    return (
      <div>
        <h2>User Profile</h2>
        <img src={profilePicture} alt="Profile" />
        <p>Name: {name}</p>
        <p>Email: {email}</p>

        <button onClick={this.handleUpdateProfile}>Click me</button>
      </div>
    );
  }
}

export default UserProfile;
```

In this example, the UserProfile component is a PureComponent instead of a Component. The `handleUpdateProfile` method creates a new user object with the updated name instead of mutating the existing user object. This ensures that the shallow comparison in `shouldComponentUpdate` detects that the user object has changed and triggers a re-render only when necessary.

In cases where the state is a `primitive value`, React performs a simple equality check to determine if the state has changed. Note that PureComponent doesn't work great with props.children as `createElement` is used to create the children elements which will always create a new reference.

Let's consider a scenario where PureComponent might break the app. You could accidentally miss rendering updates if your prop changes are deep in a nested object. Consider the following example:

```jsx
import React, { PureComponent } from 'react';

class UserProfile extends PureComponent {
  render() {
    const { name, email, address } = this.props.user;

    return (
      <div>
        <h2>User Profile</h2>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <p>
          Address: {address.street}, {address.city}, {address.country}
        </p>
      </div>
    );
  }
}

export default UserProfile;
```

In this example, the UserProfile component receives a `user` prop that contains nested objects like `address`.

```jsx
import React, { Component } from 'react';
import UserProfile from './UserProfile';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        address: {
          street: '123 Main St',
          city: 'City',
          country: 'Country',
        },
      },
    };
  }

  componentDidMount() {
    // Simulate updating user's address after 5 seconds
    setTimeout(() => {
      const updatedUser = { ...this.state.user };
      updatedUser.address.street = '456 Elm St';
      this.setState({ user: updatedUser });
    }, 5000);
  }

  render() {
    return (
      <div>
        <h1>User Information</h1>
        <UserProfile user={this.state.user} />
      </div>
    );
  }
}

export default App;
```

In this example, the App component updates the user's address after 5 seconds by creating a new user object with the updated address. However, because the reference to the `user` prop remains the same, the PureComponent in the UserProfile component will not detect the change in the nested `address` object and will not trigger a re-render. This can lead to the UI not reflecting the updated address and causing inconsistencies in the application.

## Question 2

### Q. Context + ShouldComponentUpdate might be dangerous. Why is that?

Before we dive into why using `Context` with `shouldComponentUpdate` might be dangerous, let's first understand what each of these features do in React.

- **Context**: Context provides a way to pass data through the component tree without having to pass props down manually at every level. It allows you to share values like themes, locales, or authentication information across the entire React component tree.

- **shouldComponentUpdate**: The `shouldComponentUpdate` method is a lifecycle method in React class components that allows you to control whether the component should re-render or not. It returns a boolean value indicating whether the component should update based on the changes in props or state.

Now, let's consider the following scenario where using `Context` with `shouldComponentUpdate` might be dangerous. Consider a scenario where we have a ThemeContext that provides the current theme to multiple components in the app. We have a ThemeProvider component that manages the theme state and updates it based on user preferences.

```jsx
// ThemeContext.js
import React from 'react';

const ThemeContext = React.createContext('light');

export default ThemeContext;
```

```jsx
// ThemeProvider.js
import React, { Component } from 'react';
import ThemeContext from './ThemeContext';

class ThemeProvider extends Component {
  state = {
    theme: 'light',
  };

  toggleTheme = () => {
    this.setState(prevState => ({
      theme: prevState.theme === 'light' ? 'dark' : 'light',
    }));
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{ theme: this.state.theme, toggleTheme: this.toggleTheme }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}
```

Now, let's create a ThemeConsumer component that consumes the theme value and renders a message based on the current theme:

```jsx
// ThemeConsumer.js
import React, { Component } from 'react';
import ThemeContext from './ThemeContext';

class ThemeConsumer extends Component {
  static contextType = ThemeContext;

  shouldComponentUpdate(nextProps, nextState) {
    console.log('ThemeConsumer shouldComponentUpdate');
    return true;
  }

  render() {
    console.log('ThemeConsumer render');
    const { theme } = this.context;
    return (
      <div
        style={{
          color: theme === 'light' ? 'black' : 'white',
          backgroundColor: theme,
        }}
      >
        Theme: {theme}
      </div>
    );
  }
}

export default ThemeConsumer;
```

Now, let's create the App component that uses the ThemeProvider to provide the theme context and renders the ThemeConsumer component:

```jsx
// App.js
import React, { Component } from 'react';
import ThemeProvider from './ThemeProvider';
import ThemeConsumer from './ThemeConsumer';

class App extends Component {
  render() {
    console.log('App render');
    return (
      <div>
        <h1>Theme App</h1>
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
```

You'll notice that clicking the "Toggle Theme" button triggers a re-render of the App component, which causes a re-render of the ThemeProvider, and subsequently, the ThemeConsumer component, even though the theme value itself hasn't changed for the ThemeConsumer. This is because the propagation from Provider to its descendant consumers is not subject to the shouldComponentUpdate method, so the consumer is updated even when an ancestor component skips an update.

This scenario illustrates how the lack of consideration for shouldComponentUpdate in the propagation from Provider to its descendant consumers can lead to unnecessary re-renders and performance issues.

## Question 3

### Q. Describe 3 ways to pass information from a component to its PARENT

The 3 ways to pass information from a child component to its parent component in React are:

1. **Callback Functions**: The parent component passes a function as a prop to the child component, and the child component calls this function with the necessary argument.

```jsx
// ProductList component (parent)
import React, { useState } from 'react';

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = product => {
    setSelectedProduct(product);
  };

  return (
    <div>
      <h1>Product List</h1>
      <ProductItem onSelect={handleProductSelect} />
      {selectedProduct && <p>Selected Product: {selectedProduct.name}</p>}
    </div>
  );
};

export default ProductList;
```

```jsx
// ProductItem component (child)
import React from 'react';

const ProductItem = ({ onSelect }) => {
  const product = { id: 1, name: 'Product A' };

  return (
    <div>
      <h2>{product.name}</h2>
      <button onClick={() => onSelect(product)}>Select Product</button>
    </div>
  );
};

export default ProductItem;
```

2. **Context API**: The Context API allows you to access the handler functions or state values through the context provider and consumer components. The parent can access the context value and the child can update the context value.

```jsx
// ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

```jsx
// App.js
import React from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';

const App = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <h1>Theme App</h1>
      <PageContent theme={theme} />
      <Button onClick={toggleTheme} />
    </div>
  );
};

export default App;
```

```jsx
// PageContent.js
import React from 'react';

const PageContent = ({ theme }) => {
  return (
    <div style={{ backgroundColor: theme === 'light' ? 'white' : 'black' }}>
      Page Content
    </div>
  );
};

export default PageContent;
```

```jsx
// Button.js
import React from 'react;

const Button = ({ onClick }) => {
  return <button onClick={onClick}>Toggle Theme</button>;
};

export default Button;
```

3. **Custom Events**: You can create custom events in React using the `CustomEvent` constructor and dispatching the event from the child component. The parent component listens for the custom event and handles it accordingly.

```jsx
// ChildComponent.js
import React from 'react';

const ChildComponent = () => {
  const handleClick = () => {
    const event = new CustomEvent('customEvent', {
      detail: { message: 'Hello from child' },
    });
    window.dispatchEvent(event);
  };

  return <button onClick={handleClick}>Send Message</button>;
};

export default ChildComponent;
```

```jsx
// ParentComponent.js
import React, { useEffect } from 'react';

const ParentComponent = () => {
  useEffect(() => {
    const handleCustomEvent = event => {
      console.log('Received message:', event.detail.message);
    };

    window.addEventListener('customEvent', handleCustomEvent);

    return () => {
      window.removeEventListener('customEvent', handleCustomEvent);
    };
  }, []);

  return <ChildComponent />;
};

export default ParentComponent;
```

## Question 4

### Q. Give 2 ways to prevent components from re-rendering

- **React.memo**: React.memo is a higher-order component that memoizes the component based on its props. It prevents the component from re-rendering if the props have not changed. Here is how it works:

1. It shallowly compares the new props with the previous props.
2. If the props are the same, it returns the cached result of the component.
3. If the props have changed, it re-renders the component with the new props.

```jsx
import React from 'react';

const MyColor = React.memo(({ color }) => {
  return <div>{color}</div>;
});
```

For custom comparison logic, you can pass a comparison function as the second argument to `React.memo`:

```jsx
const MyColor = React.memo(
  ({ color }) => {
    return <div>{color}</div>;
  },
  (prevProps, nextProps) => {
    // Custom comparison logic
    return prevProps.color === nextProps.color;
  },
);
```

- **PureComponent**: PureComponent is a class component that implements a shallow comparison of props and state to determine if the component should re-render. If the props and state have not changed, the component will not re-render. A detailed explanation of PureComponent was provided in the previous question.

```jsx
import React, { PureComponent } from 'react';

class MyColor extends PureComponent {
  render() {
    return <div>{this.props.color}</div>;
  }
}
```

Apart from the above approach, there are few other ways to prevent components from re-rendering:

- **Use shouldComponentUpdate lifecycle method**: You can implement the shouldComponentUpdate lifecycle method in class components to control when the component should re-render based on the changes in props or state.

```jsx
class MyColor extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.color !== nextProps.color;
  }

  render() {
    return <div>{this.props.color}</div>;
  }
}
```

- **Use useMemo hook**: The useMemo hook can be used in functional components to memoize the result of expensive computations and prevent re-computation on every re-render.

```jsx
import React, { useMemo } from 'react';

const MyColor = ({ color }) => {
  const colorValue = useMemo(() => {
    return color;
  }, [color]);

  return <div>{colorValue}</div>;
};
```

- **Use useCallback hook**: The useCallback hook can be used to memoize callback functions and prevent them from being recreated on every re-render.

```jsx
import React, { useCallback } from 'react';

const MyColor = ({ color }) => {
  const handleClick = useCallback(() => {
    console.log(color);
  }, [color]);

  return <button onClick={handleClick}>Log Color</button>;
};
```

## Question 5

### Q. What is a fragment and why do we need it? Give an example where it might break my app

In React, if you have a group of children elements that you want to render, you have to wrap them in a parent element. This is because React components can only return a single element. Fragments provide a way to group multiple children elements without adding an extra node to the DOM. For example, instead of wrapping children in a `div`, you can use a fragment to group them together.

```jsx
import React from 'react';

const MyComponent = () => {
  return (
    <React.Fragment>
      <ChildComponent1 />
      <ChildComponent2 />
    </React.Fragment>
  );
};
```

or

```jsx
import React from 'react';

const MyComponent = () => {
  return (
    <>
      <ChildComponent1 />
      <ChildComponent2 />
    </>
  );
};
```

An example where using fragments might break your app is when you are using a fragment as a key in a list of elements. React requires a unique key for each child in a list to optimize rendering performance. If you use a fragment as a key, React will throw a warning that the key should be unique.

```jsx
import React from 'react';

const MyComponent = () => {
  const items = ['item1', 'item2', 'item3'];

  return (
    <>
      {items.map(item => (
        <React.Fragment key={item}>{item}</React.Fragment>
      ))}
    </>
  );
};
```

## Question 6

### Q. Give 3 examples of the HOC pattern

Here are three examples of the Higher Order Component (HOC) pattern in React:

1. **withAuth HOC**: An HOC that adds authentication logic to a component by checking if the user is authenticated before rendering the component.

```jsx
import React from 'react';
import { Redirect } from 'react-router-dom';

const withAuth = WrappedComponent => {
  const WithAuth = props => {
    const isAuthenticated = checkAuth(); // Check if user is authenticated

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

// Usage:
const ProfilePage = withAuth(ProfileComponent);
```

I have used this extensively in Next.js applications to protect routes that require authentication.

2. **withDataFetching HOC**: An HOC that fetches data from an API and passes it as a prop to the wrapped component.

```jsx
import React, { useState, useEffect } from 'react';

const withDataFetching = url => WrappedComponent => {
  const DataFetchingHOC = props => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const result = await response.json();
          setData(result);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };

      fetchData();
    }, [url]);

    return <WrappedComponent {...props} data={data} loading={loading} />;
  };

  return DataFetchingHOC;
};

// Usage:
const UsersWithData = withDataFetching('https://api.example.com/users')(
  UsersComponent,
);
```

This HOC can be used to fetch data from an API and pass it as props to the wrapped component.

3. **withErrorHandling HOC**: An HOC that adds error handling logic to a component by catching errors and displaying an error message.

```jsx
import React, { useState, useEffect } from 'react';

const withErrorHandling = WrappedComponent => {
  const ErrorHandlingHOC = props => {
    const [error, setError] = useState(null);

    useEffect(() => {
      const handleError = error => {
        setError(error);
        // Optionally, log the error or send it to a logging service
      };

      // Add event listeners or error boundaries to catch errors
      window.addEventListener('error', handleError);

      return () => {
        // Clean up event listeners
        window.removeEventListener('error', handleError);
      };
    }, []);

    return error ? (
      <ErrorMessage error={error} />
    ) : (
      <WrappedComponent {...props} />
    );
  };

  return ErrorHandlingHOC;
};

// Usage:
const ErrorHandledComponent = withErrorHandling(MyComponent);
```

This HOC can be used to catch errors that occur in the wrapped component and display an error message.

## Question 7

### Q. What's the difference in handling exceptions in promises, callbacks and async...await?

Following are the differences in handling exceptions in promises, callbacks, and async/await:

1. **Promises**:
   - Promises use the `.then()` and `.catch()` methods to handle success and error cases.
   - Errors can be caught using the `.catch()` method at the end of the promise chain.
   - If an error occurs in a promise chain and is not caught, it will result in an unhandled promise rejection error.
   - Promises are chainable, allowing you to handle multiple asynchronous operations sequentially.
   - You can also throw an error inside a `.then()` block to trigger the `.catch()` block.

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

2. **Callbacks**:
   - Callbacks are functions that are passed as arguments to other functions and are called when an operation completes.
   - Errors in callbacks are typically handled by passing an error parameter as the first argument to the callback function using the Node.js convention.
   - Callbacks can lead to callback hell or pyramid of doom when dealing with multiple nested operations.
   - Error handling in callbacks can be cumbersome and error-prone due to the lack of built-in mechanisms for error propagation.

```javascript
function fetchData(callback) {
  if (error) {
    callback(new Error('Failed to fetch data'));
  } else {
    callback(null, data);
  }
}

fetchData((error, data) => {
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
});
```

3. **Async/Await**:
   - Async/await is a modern approach to handling asynchronous operations in JavaScript using the `async` and `await` keywords.
   - The `async` keyword is used to define an asynchronous function that returns a promise.
   - The `await` keyword is used to pause the execution of an async function until a promise is settled.
   - Errors in async functions can be caught using `try/catch` blocks, providing a more synchronous style of error handling.
   - Async/await is built on top of promises and provides a cleaner and more readable syntax for handling asynchronous code.

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

fetchData();
```

Async/await is generally considered more readable and easier to reason about compared to promises and callbacks, especially when dealing with complex asynchronous code.

## Question 8

### Q. How many arguments does setState take and why is it async

The `setState` method in React takes two arguments:

1. **Partial State Object or Function**: The first argument to `setState` can be an object that represents the partial state changes to be merged with the current state, or it can be a function that returns the partial state object.

2. **Callback Function (Optional)**: The second argument to `setState` is an optional callback function that is executed after the state has been updated and the component has re-rendered.

```javascript
// Using an object as the partial state
this.setState({ count: this.state.count + 1 });

// Using a function to update the state based on the previous state
this.setState(
  prevState => ({ count: prevState.count + 1 }),
  () => {
    console.log('State updated');
  },
);
```

The reason why `setState` is asynchronous in React is to optimize performance by batching multiple state updates into a single re-render cycle. When you call `setState`, React schedules the state update and re-render, but it doesn't immediately update the state or re-render the component. Instead, React batches multiple `setState` calls together and performs a single re-render at the end of the event loop.

## Question 9

### Q. List the steps needed to migrate a Class to Function Component

To migrate a class component to a function component in React, you can follow these steps:

1. **Remove Class Syntax**: Remove the `class` keyword and extend `React.Component` from the component declaration. Also, remove the `render` method and return JSX directly from the function body.

```jsx
// Before
class MyComponent extends React.Component {
  render() {
    return <div>Hello, World!</div>;
  }
}

// After
function MyComponent() {
  return <div>Hello, World!</div>;
}
```

2. **Remove `this` Keyword**: Remove the `this` keyword from class component methods and access props directly in function components. Props are passed as arguments to the function component.

```jsx
// Before
class MyComponent extends React.Component {
  render() {
    return <div>Hello, {this.props.name}!</div>;
  }
}

// After
function MyComponent({ name }) {
  return <div>Hello, {name}!</div>;
}
```

3. **Remove Lifecycle Methods**: Replace class component lifecycle methods with React hooks in function components. A common replacement is using the `useEffect` hook for `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` lifecycle methods.

```jsx
// Before
class MyComponent extends React.Component {
  componentDidMount() {
    console.log('Component mounted');
  }

  render() {
    return <div>Hello, World!</div>;
  }
}

// After
import React, { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    console.log('Component mounted');

    // Cleanup function for componentWillUnmount
    return () => {
      console.log('Component will unmount');
    };

    // Optional dependency array for componentDidUpdate which will re-run the effect when the dependency changes
    // Empty array means it will only run once after the initial render
  }, []);

  return <div>Hello, World!</div>;
}
```

4. **Convert State to `useState` Hook**: Replace class component state with the `useState` hook in function components.

```jsx
// Before
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  toggleCount = () => {
    this.setState(prevState => ({ count: prevState.count + 1 }));
  };

  render() {
    return <div>Count: {this.state.count}</div>;
  }
}

// After
import React, { useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  const toggleCount = () => {
    setCount(count => count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

5. **Remove Constructor**: Remove the constructor method and move any initialization logic to the function body.

```jsx
// Before
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return <div>Count: {this.state.count}</div>;
  }
}

// After
function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Question 10

### Q. List a few ways styles can be used with components

In React, there are several ways to style components. Some of the common ways include:

1. **Inline Styles**: You can apply styles directly to JSX elements using the `style` attribute. Inline styles are defined as objects where the keys are CSS properties in camelCase.

```jsx
const MyComponent = () => {
  const styles = {
    color: 'red',
    fontSize: '16px',
  };

  return <div style={styles}>Hello, World!</div>;
};
```

2. **CSS Classes**: You can apply CSS classes to JSX elements using the `className` attribute. CSS classes are defined in external CSS files.

```jsx
import './styles.css';

const MyComponent = () => {
  return <div className="my-component">Hello, World!</div>;
};
```

3. **CSS Modules**: CSS Modules allow you to write modular CSS styles that are scoped to a specific component. CSS Modules generate unique class names for each component, preventing style conflicts.

```jsx
import styles from './MyComponent.module.css';

const MyComponent = () => {
  return <div className={styles.myComponent}>Hello, World!</div>;
};

// MyComponent.module.css
.myComponent {
  color: red;
  font-size: 16px;
}
```

4. **Styled Components**: Styled components is a CSS-in-JS library that allows you to define styles directly within your components using tagged template literals.

```jsx
import styled from 'styled-components';

const StyledDiv = styled.div`
  color: red;
  font-size: 16px;
`;

const MyComponent = () => {
  return <StyledDiv>Hello, World!</StyledDiv>;
};
```

5. **CSS-in-JS Libraries**: There are several CSS-in-JS libraries like Emotion, styled-components, and JSS that allow you to define styles in JavaScript and apply them to components.

```jsx
import { css } from '@emotion/react';

const MyComponent = () => {
  const styles = css`
    color: red;
    font-size: 16px;
  `;

  return <div css={styles}>Hello, World!</div>;
};
```

6. **Global Styles**: You can apply global styles to your application using CSS files or CSS-in-JS libraries. Global styles are applied to the entire application.

```jsx
// styles.css
body {
  font-family: 'Arial', sans-serif;
}

// App.js
import './styles.css';

const App = () => {
  return <div>Hello, World!</div>;
};
```

7. **CSS Preprocessors**: You can use CSS preprocessors like Sass, Less, or Stylus to write styles with additional features like variables, mixins, and nesting.

```scss
// styles.scss
$primary-color: blue;

.my-component {
  color: $primary-color;
}
```

```jsx
// MyComponent.js
import './styles.scss';

const MyComponent = () => {
  return <div className="my-component">Hello, World!</div>;
};
```

8. **Tailwind CSS**: Tailwind CSS is a utility-first CSS framework that provides a set of pre-built utility classes for styling components.

```jsx
const MyComponent = () => {
  return <div className="text-red-500 text-lg">Hello, World!</div>;
};
```

## Question 11

### Q. How to render an HTML string coming from the server

Here's how you can render an HTML string coming from the server in React:

```jsx
import React from 'react';

const MyComponent = ({ htmlString }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};
```

In the above example, the `htmlString` prop contains the HTML content that you want to render. By using `dangerouslySetInnerHTML`, you can set the inner HTML of the `div` element to the value of `htmlString`. React will render the HTML content as it is without escaping it.

It's important to note that using `dangerouslySetInnerHTML` can expose your application to XSS attacks if the HTML content is not sanitized properly. Make sure to sanitize the HTML content on the server-side before sending it to the client to prevent malicious scripts from being executed.

You can use a library like `DOMPurify` to sanitize the HTML content before rendering it in your React application:

```bash
npm install dompurify
```

```jsx
import React from 'react';
import DOMPurify from 'dompurify';

const MyComponent = ({ htmlString }) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlString);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};
```

By sanitizing the HTML content with `DOMPurify`, you can prevent XSS attacks and ensure that the rendered HTML is safe to display in your React application.
