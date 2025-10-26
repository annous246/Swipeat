import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import icons from "@/app/constants/icons";
import Message from "./Message";
import { Post } from "@/app/services/api";
import { AuthContext } from "@/app/context/AuthProvider";
import ChatLoading from "./ChatLoading";

interface Message {
  content: string;
  me: boolean;
}
const Chat = () => {
  const AuthSettings = useContext(AuthContext);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [wait, setWait] = useState<boolean>(true);
  const scroller = useRef<any>(null);
  function sendMessage(message: string, me: boolean) {
    setMessages((prev: Message[]) => [...prev, { content: message, me: me }]);

    if (scroller) scroller.current?.scrollToEnd({ animated: true });
  }
  async function getResponse() {
    let answer = "Service Is temporarely down";
    try {
      //API CODE HERE TODO

      const res: any = await Post(
        "https://swipeat-chatbot-api-js-version.onrender.com/ask",
        { query: message }
      );
      console.log("res");
      console.log(res);
      answer = res.response ?? "Service Is temporarely down";
      //** */
    } catch (e) {
      console.log("error getting response from chatbot ai");
    }

    sendMessage(answer, false);
    setWait(false);
  }
  function send() {
    if (!message || !message.length) return;

    getResponse();
    sendMessage(message, true);
    setMessage("");
    setWait(true);
  }
  function handleChange(input: string) {
    setMessage(input);
  }
  useEffect(() => {
    setMessages([]);
    const gender = AuthSettings.user.gender ? "Mrs" : "Mr";
    const username = AuthSettings.user.username;
    const id = setTimeout(() => {
      sendMessage(
        `Hello ${gender} ${username} How Can I Assist You Today?`,
        false
      );
      setWait(false);
    }, 200);

    return () => clearTimeout(id);
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scroller}
        style={{
          backgroundColor: "white",
          width: "100%",
        }}
      >
        {messages.map((messageItem: Message, index: number) =>
          !messageItem.me ? (
            <Message
              key={index}
              me={messageItem.me}
              icon={icons.gemini}
              content={messageItem.content}
            />
          ) : (
            <Message
              key={index}
              me={messageItem.me}
              content={messageItem.content}
            />
          )
        )}
        {wait && <ChatLoading />}
        <View
          style={{ width: "100%", backgroundColor: "transparent", height: 100 }}
        ></View>
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          onChangeText={handleChange}
          value={message}
          style={styles.input}
        />

        <TouchableOpacity style={styles.close} onPress={send} disabled={wait}>
          <Image source={icons.send} style={{ height: "50%", width: "50%" }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  close: {
    width: 35,
    backgroundColor: "white",
    height: 35,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 10,
    margin: "auto",
  },
  input: {
    backgroundColor: "white",
    width: "85%",
    height: 40,
    borderRadius: 15,
    fontSize: 13,
    padding: 7,
  },
  container: {
    position: "relative",
    backgroundColor: "white",
    width: "100%",
    height: "90%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  footer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    width: "100%",
    height: 50,
    backgroundColor: "#f1f1f1ff",
    padding: 5,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
});
