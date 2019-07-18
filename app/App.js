import React, { useState, useRef } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Image, ThemeProvider, Input, Button } from 'react-native-elements';
import validator from 'validator'
import axios from 'axios'

import constants from './constants'

const { colors } = constants

const theme = {
  Input: {
    style: {
      color: colors.secondary
    },
    labelStyle: {
      marginTop: 16,
      color: colors.primary
    },
    placeholderTextColor: colors.secondaryFaded
  },
  Button: {
    buttonStyle: {
      backgroundColor: colors.primary
    },
    disabledStyle: {
      backgroundColor: colors.primaryFaded
    },
    disabledTitleStyle: {
      color: 'white'
    }
  }
};

const client = axios.create({
  baseURL: 'https://overload.andrew41.now.sh'
})

export default function App () {

  const nameEl = useRef(null)
  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ emailError, setEmailError ] = useState(null)
  const [ title, setTitle ] = useState('')
  const [ companyName, setCompanyName ] = useState('')
  const [ isSubmitting, setSubmitting ] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      let payload = {
        name,
        email,
        tags: ['event_ipad']
      }
      if (title) {
        payload.title = title
      }
      if (companyName) {
        payload.companyName = companyName
      }
      await client.post('/submit_lead', {
        name,
        email,
        title,
        companyName
      })
    } catch (err) {
      console.error(err)
    }

    setName('')
    setEmail('')
    setEmailError(null)
    setTitle('')
    setCompanyName('')

    setSubmitting(false)

    nameEl.current.focus()
    nameEl.current.blur()
  }

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.rootView}>
        <KeyboardAvoidingView behavior='height' style={{ flex: 1 }}>
          <View style={styles.bannerView}>
            <Image
              source={require('./assets/boltsource-banner-logo.png')}
              style={styles.banner}
              resizeMode='contain'
            />
          </View>
          <View style={styles.inputView}>
            <Input
              containerStyle={{ width: '90%' }}
              placeholder="John Doe"
              placeholderTextColor={colors.secondaryFaded}
              label="Full Name"
              autoCapitalize='words'
              ref={nameEl}
              value={name}
              autoCorrect={false}
              disabled={isSubmitting}
              onChangeText={name => setName(name)}
            />
            <Input
              containerStyle={{ width: '90%' }}
              placeholder="john.doe@acme.co"
              placeholderTextColor={colors.secondaryFaded}
              errorMessage={emailError}
              label="Email"
              type='email'
              autoCorrect={false}
              autoCapitalize='none'
              autoCompleteType='email'
              value={email}
              keyboardType='email-address'
              disabled={isSubmitting}
              onBlur={(e) => {
                if (email && !validator.isEmail(email)) {
                  setEmailError('Invalid email address')
                }
              }}
              onChangeText={email => {
                setEmailError(null)
                setEmail(email)
              }}
              onFocus={() => setEmailError(null)}
            />
            <Input
              containerStyle={{ width: '90%' }}
              placeholder="Software Engineer"
              placeholderTextColor={colors.secondaryFaded}
              label="Work Title"
              autoCapitalize='words'
              value={title}
              autoCorrect={false}
              disabled={isSubmitting}
              onChangeText={title => setTitle(title)}
            />
            <Input
              containerStyle={{ width: '90%' }}
              autoCapitalize='words'
              placeholder="Acme Co"
              placeholderTextColor={colors.secondaryFaded}
              label="Company Name"
              value={companyName}
              autoCorrect={false}
              disabled={isSubmitting}
              onChangeText={companyName => setCompanyName(companyName)}
            />
          </View>
          <View style={styles.buttonView}>
            <Button
              onPress={handleSubmit}
              containerStyle={{ width: '90%' }}
              title="Submit"
              type="solid"
              raised={true}
              loading={isSubmitting}
              disabled={isSubmitting || !email || !name || emailError}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
  bannerView: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  banner: {
    flex: 1
  },
  inputView: {
    marginTop: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 36
  }
});
