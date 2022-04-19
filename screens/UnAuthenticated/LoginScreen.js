import React, { useState, useReducer } from 'react';
import { Constants } from 'expo'
import {
    Container,
    Header,
    Button,
    Text,
    FormControl,
    Item as FormItem,
    Input,
    Link,
    VStack,
    IconButton,
    Box,
    Stack,
} from 'native-base';

import { View, Image, StyleSheet, ImageBackground, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import Axios from "axios";

import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/authActions'

// Custom Components
import CustomText from '../../components/native/CustomText';
import Values from '../../constants/Values';

const formReducer = (state, action) => {
    if (action.type === "UPDATE") {
        const updatedValues = { ...state.inputValues, [action.input]: action.value }
        const updatedValidities = { ...state.inputValidities, [action.input]: action.isValid }

        let formIsValid = true
        for (const key in updatedValidities) {
            formIsValid = formIsValid && updatedValidities[key]
        }

        return { ...state, inputValues: updatedValues, inputValidities: updatedValidities, formIsValid: formIsValid }
    }
    return state;
}

export default function LoginScreen(props) {

    const dispatch = useDispatch();

    // Show password or not
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        emailValid: true,
        passwordValid: true,
    });
    const [errors, setErrors] = useState({});

    const [formState, dispatchForm] = useReducer(formReducer, {
        inputValues: {
            email: "",
            password: "",
        },
        inputValidities: {
            email: false,
            password: false,
        },
        formIsValid: false,
    })

    const emailValid = (value) => {
        const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (regexEmail.test(value)) {
            return true
        } else {
            return false
        }
    }
    const passwordValid = (value) => {
        if (value.length >= 6) {
            return true
        } else {
            return false
        }
    }

    // Handle any key change
    const inputChange = (key, value) => {
        if (key === 'email') {
            const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (regexEmail.test(value)) {
                setFormData({ ...formData, [key]: value, emailValid: true })
            } else {
                setFormData({ ...formData, [key]: value, emailValid: false })
            }
        }

        if (key === 'password') {
            if (value.length >= 6) {
                setFormData({ ...formData, [key]: value, passwordValid: true })
            } else {
                setFormData({ ...formData, [key]: value, passwordValid: false })
            }
        }
    }

    // Login user func, first validate
    const loginUser = async () => {
        if (formState.inputValidities.email && formState.inputValidities.password) {
            // await Axios.post(`http://localhost:8081/api/v1/user/login`)
            //     .then(async (response) => {
            //         if (response.status === 201) {
            //             // props.navigation.navigate('Home')
            //             // console.log('Submitted')

            //         } else {
            //             console.log('Falsee')
            //         }
            //     })
            // props.navigation.navigate('Home')
            console.log('Submitted')
            console.log(formState)
            dispatch(authActions.signUp(formState.inputValues.email,formState.inputValues.password))
        } else {
            // props.navigation.navigate('Home')
            // console.log('Submitted')
            console.log('Validation Failed');
        }
    }

    return (
        <ImageBackground style={styles.background} source={require("../../assets/images/loginBg.png")} resizeMode="cover">
            {/* <KeyboardAvoidingView behavior='padding'> */}
            <ScrollView style={{ marginTop: 300 }}>

                <Box alignItems="center">
                    <Image style={styles.image} source={require("../../assets/images/logo.png")} />
                    <CustomText color="white" style={{ marginTop: -20, marginBottom: 10 }} fontSize="lg">Login to your Account</CustomText>

                    <VStack space={1}>
                        <Input
                            style={styles.input}
                            // borderColor={!formState.inputValidities.email && "red.300"}
                            color="white"
                            variant="rounded"
                            size={"md"}
                            w={"75%"}
                            InputLeftElement={<MaterialIcons name="account-circle" size={32} color="white" style={{ padding: 10 }} />}
                            placeholder="Email"
                            value={formState.inputValues.email}
                            // onChangeText={value => inputChange("email", value)}
                            onChangeText={value => dispatchForm({ type: "UPDATE", value: value, isValid: emailValid(value), input: "email" })}
                        />
                        {!formState.inputValidities.email ? <Text fontSize="sm" style={styles.error} >Enter a valid Email</Text> : null}


                        <Input
                            style={styles.input}
                            color="white"
                            // borderColor={!formState.inputValidities.password && "red.300"}
                            variant="rounded"
                            w={"75%"}
                            InputLeftElement={<Ionicons name="key-outline" size={32} color="white"
                                style={{ padding: 10 }} />} placeholder="Password"
                            type={show ? "customtext" : "password"}
                            InputRightElement={
                                <IconButton color="white" key={"solid"}
                                    _icon={{ as: Ionicons, name: show ? "eye-off-outline" : "eye-outline", color: "white" }}
                                    onPress={handleClick}
                                />
                            }
                            // onChangeText={value => inputChange("password", value)}
                            onChangeText={value => dispatchForm({ type: "UPDATE", value: value, isValid: passwordValid(value), input: "password" })}

                        />
                        {!formState.inputValidities.password ? <Text fontSize="sm" style={styles.error} >Password must be at least 6 characters</Text> : null}

                    </VStack>

                    <Stack space={2} w="100%" alignItems="center">

                        <Link onPress={() => { props.navigation.navigate('ForgetPassword') }} isUnderlined={true} _text={{ color: Values.textColor }}>
                            Forget Password?
                        </Link>
                        <Button colorScheme="green" style={styles.customButton} onPress={loginUser}>Login</Button>

                        <CustomText color="#b3b3ff" italic style={{}}>No account yet? Sign Up Now</CustomText>
                        <Button style={{ width: "30%" }} onPress={() => props.navigation.navigate('Register')}>Register</Button>
                    </Stack>
                </Box>
            </ScrollView>
            {/* </KeyboardAvoidingView> */}
        </ImageBackground>
    )
}

const styles = StyleSheet.create({

    background: {
        flex: 1,
        justifyContent: "center",
    },

    image: {
        width: 175,
        height: 100,
    },

    input: {
        // border: "red",
    },

    customButton: {
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 50
    },

    // Styles for Error text under input
    error: {
        color: "#ff0000",
        marginTop: -5,
        marginBottom: 10,
        marginLeft: 15,
    },
})