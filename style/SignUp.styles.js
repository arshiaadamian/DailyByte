import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E1DED3',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  heading: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 32,
    color: '#2F2E2C',
    marginBottom: 4,
  },
  subheading: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 18,
    color: '#5A5546',
    marginBottom: 32,
  },
  label: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 15,
    color: '#5A5546',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 17,
    color: '#2F2E2C',
    backgroundColor: '#C6BDAB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  error: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 15,
    color: '#B3261E',
    marginTop: 16,
  },
  passwordRow: {
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeButton: {
    position: 'absolute',
    right: 4,
    top: 0,
    bottom: 0,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 32,
    backgroundColor: '#816148',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 17,
    color: '#E1DED3',
  },
  resendButton: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendButtonPressed: {
    opacity: 0.6,
  },
  resendButtonText: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 15,
    color: '#816148',
    textDecorationLine: 'underline',
  },
});

export default styles;