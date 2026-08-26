import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E1DED3',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 80,
  },
  hero: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    marginBottom: 28,
  },
  heading: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 44,
    color: '#2F2E2C',
    textAlign: 'center',
    marginBottom: 18,
  },
  subheading: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 19,
    lineHeight: 28,
    color: '#5A5546',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#816148',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
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
    fontSize: 14,
    color: '#5A5546',
    paddingBottom: 20
  },
});

export default styles;
