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
    button: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#5A5546',
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
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