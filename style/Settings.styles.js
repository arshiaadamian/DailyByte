import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1DED3',
    padding: 24,
    paddingTop: 60,
  },
  heading: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 32,
    color: '#2F2E2C',
    marginBottom: 32,
  },
  message: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 20,
    color: '#5A5546',
  },
  card: {
    backgroundColor: '#C6BDAB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  label: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 15,
    color: '#5A5546',
    marginBottom: 4,
  },
  value: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 18,
    color: '#2F2E2C',
  },
  error: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 15,
    color: '#B3261E',
    marginBottom: 16,
  },
  button: {
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
  section: {
    marginTop: 40,
  },
  sectionTitle: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 22,
    color: '#2F2E2C',
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 15,
    color: '#5A5546',
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: '#C6BDAB',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
  },
  dropdownPlaceholder: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 16,
    color: '#7A7461',
  },
  dropdownSelectedText: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 16,
    color: '#2F2E2C',
  },
  dropdownContainer: {
    backgroundColor: '#E1DED3',
    borderRadius: 10,
    borderColor: '#C6BDAB',
    borderWidth: 1,
  },
  dropdownItemText: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 16,
    color: '#2F2E2C',
  },
  saveButton: {
    backgroundColor: '#816148',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 17,
    color: '#E1DED3',
  },
  successMessage: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 15,
    color: '#3D6B4F',
    marginTop: 12,
  },
  preferenceError: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 15,
    color: '#B3261E',
    marginTop: 12,
  },
});

export default styles;