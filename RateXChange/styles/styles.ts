import { StyleSheet } from "react-native";

const StyleHome = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        
      },
      box1: {
        backgroundColor: 'salmon',
        padding: 10,
      },
});

const styleCurrencyRate = StyleSheet.create({
  containerTop: {
    backgroundColor: "#4A90E2",
    padding: 20,
    height: "40%",
    borderRadius: 15,
  },
  exchangeText: {
    fontSize: 18,
    color: "white",
    marginBottom: 5,
  },
  resultText: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    elevation: 8,
  },
  input: {
    backgroundColor: "white",
    width: "30%",
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 20,
    color: "black",
  },
  resultRateText: {
    marginTop: 30,
    marginLeft: 20,
  },
  separator: {
    width: 1,
    height: 50,
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
  rateTodayText: {
    fontSize: 18,
    color: "#0054fc",
    fontWeight: "bold",
    marginBottom: 15,
  },
  containerBottom: {
    margin: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    elevation: 1,
  },
  currencyRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 20,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    elevation: 3,
  },
  showCountries: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ececec",
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 30,
    width: 140,
    height: 45,
  },
  showThailandFlag: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#ececec",
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 30,
    width: 150,
    height: 45,
  },
  currencyName: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  currencyValue: {
    fontSize: 16,
    marginRight: 10,
  },
  flag: {
    width: 40,
    height: 30,
    resizeMode: "contain",
  },
  swapButton: {
    position: "absolute",
    top: "45%",
    left: "47%",
    backgroundColor: "#007AFF",
    padding: 4,
    borderRadius: 25,
    zIndex: 10,
  },
});

const pickerSelectStyles = {
  inputAndroid: {
    fontSize: 23,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    width: 200,
  },
};


export { StyleHome, styleCurrencyRate, pickerSelectStyles };