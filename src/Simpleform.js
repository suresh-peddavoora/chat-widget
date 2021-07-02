import React, { Component } from "react";
import PropTypes from "prop-types";
import ChatBot from "react-simple-chatbot";
import axios from "axios";
import configData from "./config.json";
import { ThemeProvider } from "styled-components";

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userMessege: "",
      apiResponse: "",
    };
  }

  componentWillMount() {
    const { steps } = this.props;
    const { userMessege, apiResponse } = steps;
    var self = this;
    this.setState({ userMessege, apiResponse });
    if (userMessege.value !== "") {
      console.log(userMessege.value);
      axios({
        method: "post",
        url: configData.SERVER_URL + "answer",
        data: {
          user_quest: userMessege.value,
        },
      })
        .then(function(response) {
          self.setState({ apiResponse: response.data.Answer }); //HERE WE SET BACKEDN RESOPNSE TO CHATBOT
        })
        .catch(function(error) {
          console.log(error);
        });
      console.log(self.state.apiResponse);
    }
  }

  render() {
    return (
      <div style={{ width: "500%" }}>
        
        <table>
          <tbody>
            <tr>
              <td>{this.state.apiResponse}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

Review.propTypes = {
  steps: PropTypes.object,
  headerTitle: PropTypes.string,
  hideBotAvatar: PropTypes.bool,
  hideUserAvatar: PropTypes.bool,
  enableSmoothScroll: PropTypes.bool,
  floating: PropTypes.bool,
  userDelay: PropTypes.number,
  botDelay: PropTypes.number,
};

Review.defaultProps = {
  steps: undefined,
};
const theme = {
  background: "white",
  fontFamily: "Helvetica",
  headerBgColor: "rgb(37,211,102)",
  headerFontColor: "white",
  headerFontSize: "19px",
  botBubbleColor: "whitesmoke",
  botFontColor: "black",
  userBubbleColor: "rgb(196,255,196)",
  userFontColor: "black",
};
class SimpleForm extends Component {
  render() {
    return (
    <div>

      
      <ThemeProvider theme={theme}>

        <ChatBot
        
          steps={[
            {
              id: "1",
              message: "Type something you want to Know",
              trigger: "userMessege",
            },
            {
              id: "2",
              message: "want to Know more?",
              trigger: "userMessege",
            },
            {
              id: "userMessege",
              user: true,
              trigger: "review",
            },
            {
              id: "review",
              component: <Review />,
              asMessage: true,
              trigger: "userMessege",
            },
          ]}
          hideBotAvatar="false"
          hideUserAvatar="false"
          enableSmoothScroll="true"
          floating="true"
          
          headerTitle="Hi there !...👋"
          userDelay="1000"
          botDelay="1000"
        />
        
      </ThemeProvider>
     
     </div> ); 
  }
}

export default SimpleForm;
