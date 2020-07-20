import React, { useState } from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from "react-apollo-hooks";
import { LOG_IN, CREATE_ACCOUNT } from "./AuthQueries";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default ({ navigation }) => {
  console.log("param : ", navigation.state.params);
  const email =
    navigation.state.params && navigation.state.params.email
      ? navigation.state.params.email
      : "";
  const fNameInput = useInput("");
  const lNameInput = useInput("");
  const emailInput = useInput(email);
  const usernameInput = useInput("");
  const [createAccountMutation, { loading: cLoading }] = useMutation(
    CREATE_ACCOUNT,
    {
      variables: {
        name: usernameInput.value,
        email: emailInput.value,
        firstName: fNameInput.value,
        lastName: lNameInput.value,
      },
    }
  );
  const handleSingup = async () => {
    const { value: email } = emailInput;
    const { value: fName } = fNameInput;
    const { value: lName } = lNameInput;
    const { value: username } = usernameInput;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (fName === "") {
      return Alert.alert("Invalid First name");
    }
    if (lName === "") {
      return Alert.alert("Invalid Last name");
    }
    if (!emailRegex.test(email)) {
      return Alert.alert("Invalid Email");
    }
    if (username === "") {
      return Alert.alert("Invalid User name");
    }
    try {
      const {
        data: { createAccount },
      } = await createAccountMutation();
      if (createAccount) {
        Alert.alert("Account created", "Log In Now!");
        navigation.navigate("Login", { email });
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Email taken.", "Log in instead");
      navigation.navigate("Login", { email });
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...fNameInput}
          placeholder="First name"
          autoCapitalize="words"
        />
        <AuthInput
          {...lNameInput}
          placeholder="Last name"
          autoCapitalize="words"
        />
        <AuthInput
          {...emailInput}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthInput
          {...usernameInput}
          placeholder="User name"
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthButton loading={cLoading} onPress={handleSingup} text="Sign up" />
      </View>
    </TouchableWithoutFeedback>
  );
};
