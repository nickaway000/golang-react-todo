import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";

let endpoint = "http://localhost:9000";

class ToDoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: "",
      items: [],
    };
  }

  componentDidMount() {
    this.getTask();
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onSubmit = () => {
    let { task } = this.state;
    if (task) {
      axios
        .post(
          endpoint + "/api/tasks",
          { task },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log("Task created:", res);
          this.getTask();
          this.setState({
            task: "",
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  getTask = () => {
    axios.get(endpoint + "/api/task").then((res) => {
      console.log("Tasks retrieved:", res.data);
      if (res.data) {
        this.setState({
          items: res.data.map((item) => {
            let color = "yellow";
            let style = {
              wordWrap: "break-word",
            };

            if (item.status) {
              color = "lightgreen";
              style["textDecorationLine"] = "line-through";
            } else {
              color = "lightcoral";
            }
            return (
              <Card key={item._id} style={{ backgroundColor: color }} fluid className="rough">
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div style={style}>{item.task}</div>
                  </Card.Header>
                  <Card.Meta textAlign="right">
                    {item.status ? (
                      <React.Fragment>
                        <span style={{ paddingRight: 10 }}>Done</span>
                        <Icon
                          name="undo"
                          color="blue"
                          onClick={() => this.undoTask(item._id)}
                        />
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Icon
                          name="check circle"
                          color="blue"
                          onClick={() => this.updateTask(item._id)}
                        />
                        <span style={{ paddingRight: 10 }}>Undo</span>
                      </React.Fragment>
                    )}
                    <Icon
                      name="delete"
                      color="red"
                      onClick={() => this.deleteTask(item._id)}
                    />
                    <span style={{ paddingRight: 10 }}>Delete</span>
                  </Card.Meta>
                </Card.Content>
              </Card>
            );
          }),
        });
      } else {
        this.setState({
          items: [],
        });
      }
    });
  };

  updateTask = (id) => {
    axios
      .put(endpoint + "/api/tasks/" + id)
      .then((res) => {
        console.log(res);
        this.getTask();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  
  undoTask = (id) => {
    axios
      .put(endpoint + "/api/undoTask/" + id)
      .then((res) => {
        console.log(res);
        this.getTask();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  deleteTask = (id) => {
    axios
      .delete(endpoint + "/api/deleteTask/" + id, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        this.getTask();
      });
  };

  render() {
    return (
      <div>
        <div className="row">
          <Header className="header" as="h2" color="yellow">
            TO DO LIST
          </Header>
        </div>
        <div className="row">
          <Form onSubmit={this.onSubmit}>
            <Input
              type="text"
              name="task"
              onChange={this.onChange}
              value={this.state.task}
              fluid
              placeholder="Create Task"
            />
          </Form>
        </div>
        <div className="row">
          <Card.Group>{this.state.items}</Card.Group>
        </div>
      </div>
    );
  }
}

export default ToDoList;
