import React, { Component } from "react";
import PropTypes from "prop-types";
import ChatBot, { Loading } from "react-simple-chatbot";
import qs from "qs";
import axios from "axios";
import configData from "./config.json";
class DBPedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: "",
      trigger: false,
      resp: "",
    };
    

    this.triggetNext = this.triggetNext.bind(this);
  }

  componentWillMount() {
    const self = this;
    const { steps } = this.props;
    const search = steps.search.value;

    const endpoint = encodeURI("https://dbpedia.org");
    const query = encodeURI(`
      select * where {
      ?x rdfs:label "${search}"@en .
      ?x rdfs:comment ?comment .
      FILTER (lang(?comment) = 'en')
      } LIMIT 100
    `);

    const queryUrl = `https://dbpedia.org/sparql/?default-graph-uri=${endpoint}&query=${query}&format=json`;

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", readyStateChange);

    function readyStateChange() {
      if (this.readyState === 4) {
        if (search != null) {
          console.log(search);

          axios({
            method: "post",
            url: configData.SERVER_URL + "faq",
            data: qs.stringify({
              user_quest: search,
            }),
          })
            .then(function(response) {
              console.log(response.data.message);

              const bindings = response.data.message;
              if (bindings && bindings.length > 0) {
                self.setState({ loading: false, result: bindings });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      }
    }

    xhr.open("GET", queryUrl);
    xhr.send();
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div className="dbpedia">
        {loading ? <Loading /> : result}
        {!loading && (
          <div
            style={{
              textAlign: "center",
              marginTop: 20,
            }}
          >
            {!trigger && (
              <button  onClick={() => this.triggetNext()}></button>
              
            )}        <button>number1</button>

          </div>
        )}
        
      </div>
    );
  }
}

DBPedia.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
  headerTitle: PropTypes.string,
  botAvatar: PropTypes.string,
  userAvatar: PropTypes.string,
};

DBPedia.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};

const ExampleDBPedia = () => (


  <ChatBot
    steps={[
      {
        id: "1",
        message: "Type something you want to Know",
        trigger: "search",
      },
      {
        id: "search",
        user: true,
        trigger: "3",
      },
      {
        id: "3",
        component: <DBPedia />,
        trigger: "1",
      },
    ]}
    headerTitle="Dachers ChatBot"
    botAvatar="https://w7.pngwing.com/pngs/1001/63/png-transparent-internet-bot-computer-icons-chatbot-sticker-electronics-face-careobot.png"
    userAvatar="https://e7.pngegg.com/pngimages/456/700/png-clipart-computer-icons-avatar-user-profile-avatar-heroes-logo.png"
  />
);

export default ExampleDBPedia;
