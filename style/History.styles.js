import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#E1DED3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 20,
    color: '#5A5546',
    textAlign: 'center',
  },
  heading: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 28,
    color: '#2F2E2C',
    marginTop: 20,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
    gap: 16
  },
});

export default styles;