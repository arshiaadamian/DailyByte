import { StyleSheet } from 'react-native';

//ByteCard styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#C6BDAB',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topic: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 1,
    marginBottom: 20,
    backgroundColor: '#816148',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  title: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 26,
    color: '#2F2E2C',
    marginBottom: 12,
  },
  body: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 20,
    color: '#5A5546',
    lineHeight: 24,
    marginBottom: 20,
  },
  source: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 17,
    color: 'white',
    backgroundColor: '#816148',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});

export default styles;