import React from "react";
import axios from "axios";

const URL = "http://localhost:9000/api/todos";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      input: "",
    };
  }

  onChange = (e) => {
    this.setState({ ...this.state, input: e.target.value });
  };

  addTodo = (e) => {
    e.preventDefault();
    const value = this.state.input;
    this.postTodo(value);
    this.setState({ input: "" });
  };

  postTodo = (value) => {
    axios.post(URL, { name: value }).then((res) => {
      this.setState({
        ...this.state,
        todos: [...this.state.todos, res.data.data],
      });
    });
  };

  fetchAllTodos = () => {
    axios
      .get(URL)
      .then((res) => this.setState({ todos: res.data.data }))

      .catch((err) => console.log(err));
  };

  patchTodo = (id) => {
    axios
      .patch(`${URL}/${id}`)
      .then((res) => {
        this.setState({
          todos: this.state.todos.map((td) => {
            if (td.id !== id) return td;
            return res.data.data;
          }),
        });
      })
      .catch((err) => err);
    // , { completed: !this.completed });
  };

  componentDidMount() {
    this.fetchAllTodos();
  }

  completeTodo = (id) => {
    this.setState({
      todos: this.state.todos.map((todo) => {
        if (todo.id === id) {
          this.patchTodo(id);
          return todo;
        }

        return todo;
      }),
    });
  };

  render() {
    return (
      <>
        <h4>add item</h4>
        <form>
          <input
            placeholder="add item"
            value={this.state.input}
            onChange={this.onChange}
          />
          <button onClick={this.addTodo}>add</button>
        </form>

        {this.state.todos.map((todo) => {
          return (
            <>
              <h1
                style={
                  todo.completed === true ? { color: "blue" } : { color: "red" }
                }
                key={todo.id}
              >
                {" "}
                {todo.name}
              </h1>
              <h6>{todo.completed === true ? "completed" : ""} </h6>
              <button
                onClick={() => {
                  console.log(todo.name);
                  this.completeTodo(todo.id);
                }}
              >
                Complete {todo.name}
              </button>
            </>
          );
        })}
      </>
    );
  }
}
