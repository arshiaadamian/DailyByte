import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#E1DED3',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
  },
  banner: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    zIndex: 10,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  bannerSuccess: {
    backgroundColor: '#DCE9DD',
  },
  bannerError: {
    backgroundColor: '#F3D9D6',
  },
  bannerText: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 15,
  },
  bannerTextSuccess: {
    color: '#3D6B4F',
  },
  bannerTextError: {
    color: '#7A241C',
  },
  heading: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 32,
    color: '#2F2E2C',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#C6BDAB',
    borderRadius: 16,
    padding: 10,
    marginTop: 'auto',
    marginBottom: 12,
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
  signOutArea: {
    marginTop: 0,
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
    marginTop: 1,
    marginBottom: 8
  },
  saveButtonText: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 17,
    color: '#E1DED3',
  },
  // styles for the delivery-time rows, matching Onboarding.styles.js so Settings looks consistent
  deliveryRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#816148',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  deliveryRowLabel: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 16,
    color: '#F3EEE3',
  },
  deliveryRowValue: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 16,
    color: '#D9C9B3',
  },
  lockedRow: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#B7AE9B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  lockedRowText: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 14,
    color: '#5A5546',
  },
});

export default styles;