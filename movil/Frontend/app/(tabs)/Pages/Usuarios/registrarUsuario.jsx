import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";

const Register = () => {
	const [form, setForm] = useState({
		Primer_Nombre: "",
		Segundo_Nombre: "",
		Primer_Apellido: "",
		Segundo_Apellido: "",
		Tipo_documento: "",
		Numero_documento: "",
		Numero_celular: "",
		Correo_personal: "",
		Correo_empresarial: "",
		id_Rol: ""
	});
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleChange = (name, value) => {
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async () => {
		// Validación básica
		if (!form.Primer_Nombre || !form.Primer_Apellido || !form.Tipo_documento || !form.Numero_documento || !form.Numero_celular || !form.Correo_personal || !form.id_Rol) {
			Alert.alert("Error", "Por favor, completa todos los campos obligatorios.");
			return;
		}
		setLoading(true);
			try {
				const response = await fetch("http://10.1.214.182:8084/api/usuarios", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form)
				});
						if (response.ok) {
							Alert.alert("Éxito", "Usuario registrado correctamente");
							router.replace("/");
						} else {
					const data = await response.json();
					Alert.alert("Error", data.error || "No se pudo registrar el usuario");
				}
			} catch (_error) {
				Alert.alert("Error", "No se pudo conectar con el servidor");
			} finally {
				setLoading(false);
			}
	};

	return (
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>Registrar Nuevo Usuario</Text>
				<TextInput style={styles.input} placeholder="Primer Nombre*" value={form.Primer_Nombre} onChangeText={v => handleChange("Primer_Nombre", v)} />
				<TextInput style={styles.input} placeholder="Segundo Nombre" value={form.Segundo_Nombre} onChangeText={v => handleChange("Segundo_Nombre", v)} />
				<TextInput style={styles.input} placeholder="Primer Apellido*" value={form.Primer_Apellido} onChangeText={v => handleChange("Primer_Apellido", v)} />
				<TextInput style={styles.input} placeholder="Segundo Apellido" value={form.Segundo_Apellido} onChangeText={v => handleChange("Segundo_Apellido", v)} />
				<Text style={{alignSelf:'flex-start', marginBottom:4, fontWeight:'bold'}}>Tipo de Documento*</Text>
				<View style={{width:'100%', borderWidth:1, borderColor:'#ccc', borderRadius:8, marginBottom:12}}>
					<Picker
						selectedValue={form.Tipo_documento}
						onValueChange={v => handleChange("Tipo_documento", v)}
					>
						<Picker.Item label="Seleccione..." value="" />
						<Picker.Item label="C.C" value="C.C" />
						<Picker.Item label="T.I" value="T.I" />
						<Picker.Item label="PE" value="PE" />
					</Picker>
				</View>
				<TextInput style={styles.input} placeholder="Número de Documento*" value={form.Numero_documento} onChangeText={v => handleChange("Numero_documento", v)} keyboardType="numeric" />
				<TextInput style={styles.input} placeholder="Número de Celular*" value={form.Numero_celular} onChangeText={v => handleChange("Numero_celular", v)} keyboardType="phone-pad" />
				<TextInput style={styles.input} placeholder="Correo Personal*" value={form.Correo_personal} onChangeText={v => handleChange("Correo_personal", v)} keyboardType="email-address" />
				<TextInput style={styles.input} placeholder="Correo Empresarial" value={form.Correo_empresarial} onChangeText={v => handleChange("Correo_empresarial", v)} keyboardType="email-address" />
						<Text style={{alignSelf:'flex-start', marginBottom:4, fontWeight:'bold'}}>Rol*</Text>
						<View style={{width:'100%', borderWidth:1, borderColor:'#ccc', borderRadius:8, marginBottom:12}}>
							<Picker
								selectedValue={form.id_Rol}
								onValueChange={v => handleChange("id_Rol", v)}
							>
								<Picker.Item label="Seleccione..." value="" />
								<Picker.Item label="1" value="1" />
								<Picker.Item label="2" value="2" />
								<Picker.Item label="3" value="3" />
							</Picker>
						</View>
				<TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
					<Text style={styles.buttonText}>{loading ? "Guardando..." : "Registrar Usuario"}</Text>
				</TouchableOpacity>
			</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 20,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		width: "100%",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		padding: 10,
		marginBottom: 12,
		fontSize: 16,
	},
	button: {
		backgroundColor: "#4CAF50",
		padding: 14,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 10,
		width: "100%",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
});

export default Register;
