import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import BackButton from '@/components/BackButton';
<<<<<<< HEAD
import { registrarUsuarioStyles } from "../../../styles/registrarUsuarioStyles";

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
=======
import bcrypt from 'bcryptjs';

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
		id_Rol: "",
		Contrasena: ""
	});
	const [showPassword, setShowPassword] = useState(false);
	const { replaceWithLoading, showLoading, hideLoading } = useNavigationWithLoading();
>>>>>>> f8630fce5fae72300d098b4b3bbf72916a6dcb7c

  const { replaceWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

<<<<<<< HEAD
  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const handleSubmit = async () => {
    if (!form.Primer_Nombre || !form.Primer_Apellido || !form.Tipo_documento || !form.Numero_documento || !form.Numero_celular || !form.Correo_personal || !form.id_Rol) {
      Alert.alert("❌ Error", "Por favor, completa todos los campos obligatorios.");
      return;
    }

    showLoading("Registrando usuario...");
    try {
      const response = await fetch("https://tcd-production.up.railway.app/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        Alert.alert("✅ Éxito", "Usuario registrado correctamente");
        await replaceWithLoading("(tabs)/Pages/Usuarios/listarUsuarios", "Cargando lista...", 500);
      } else {
        const data = await response.json();
        Alert.alert("Error", data.error || "No se pudo registrar el usuario");
      }
    } catch (_error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <BackButton />
      <ScrollView contentContainerStyle={registrarUsuarioStyles.container}>
        <Text style={registrarUsuarioStyles.title}>📝 Registrar Nuevo Usuario</Text>

        <TextInput style={registrarUsuarioStyles.input} placeholder="Primer Nombre*" value={form.Primer_Nombre} onChangeText={v => handleChange("Primer_Nombre", v)} />
        <TextInput style={registrarUsuarioStyles.input} placeholder="Segundo Nombre" value={form.Segundo_Nombre} onChangeText={v => handleChange("Segundo_Nombre", v)} />
        <TextInput style={registrarUsuarioStyles.input} placeholder="Primer Apellido*" value={form.Primer_Apellido} onChangeText={v => handleChange("Primer_Apellido", v)} />
        <TextInput style={registrarUsuarioStyles.input} placeholder="Segundo Apellido" value={form.Segundo_Apellido} onChangeText={v => handleChange("Segundo_Apellido", v)} />

        <Text style={registrarUsuarioStyles.label}>📄 Tipo de Documento*</Text>
        <View style={registrarUsuarioStyles.pickerContainer}>
          <Picker selectedValue={form.Tipo_documento} onValueChange={v => handleChange("Tipo_documento", v)}>
            <Picker.Item label="Seleccione..." value="" />
            <Picker.Item label="C.C" value="C.C" />
            <Picker.Item label="T.I" value="T.I" />
            <Picker.Item label="P.E" value="P.E" />
          </Picker>
        </View>

        <TextInput style={registrarUsuarioStyles.input} placeholder="Número de Documento*" value={form.Numero_documento} onChangeText={v => handleChange("Numero_documento", v)} keyboardType="numeric" />
        <TextInput style={registrarUsuarioStyles.input} placeholder="Número de Celular*" value={form.Numero_celular} onChangeText={v => handleChange("Numero_celular", v)} keyboardType="phone-pad" />
        <TextInput style={registrarUsuarioStyles.input} placeholder="Correo Personal*" value={form.Correo_personal} onChangeText={v => handleChange("Correo_personal", v)} keyboardType="email-address" />
        <TextInput style={registrarUsuarioStyles.input} placeholder="Correo Empresarial" value={form.Correo_empresarial} onChangeText={v => handleChange("Correo_empresarial", v)} keyboardType="email-address" />

        <Text style={registrarUsuarioStyles.label}>👤 Rol*</Text>
        <View style={registrarUsuarioStyles.pickerContainer}>
          <Picker selectedValue={form.id_Rol} onValueChange={v => handleChange("id_Rol", v)}>
            <Picker.Item label="Seleccione..." value="" />
            <Picker.Item label="Administrador" value="1" />
            <Picker.Item label="Supervisor" value="2" />
            <Picker.Item label="Personal" value="3" />
          </Picker>
        </View>

        <TouchableOpacity style={registrarUsuarioStyles.button} onPress={handleSubmit}>
          <Text style={registrarUsuarioStyles.buttonText}>Registrar Usuario</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

=======
	const handleSubmit = async () => {
		// Validación básica
		if (!form.Primer_Nombre || !form.Primer_Apellido || !form.Tipo_documento || !form.Numero_documento || !form.Numero_celular || !form.Correo_personal || !form.id_Rol || !form.Contrasena) {
			Alert.alert("Error", "Por favor, completa todos los campos obligatorios.");
			return;
		}

		// Validar longitud de contraseña
		if (form.Contrasena.length < 6) {
			Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
			return;
		}
		showLoading("Registrando usuario...");
			try {
				// Encriptar la contraseña antes de enviarla
				console.log('🔐 Encriptando contraseña...');
				const saltRounds = 12;
				const hashedPassword = await bcrypt.hash(form.Contrasena, saltRounds);
				console.log('✅ Contraseña encriptada exitosamente');

				// Crear objeto con la contraseña encriptada
				const formWithHashedPassword = {
					...form,
					Contrasena: hashedPassword
				};

				const response = await fetch("https://tcd-production.up.railway.app/api/usuarios", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formWithHashedPassword)
				});
						if (response.ok) {
							Alert.alert("Éxito", "Usuario registrado correctamente");
							await replaceWithLoading("(tabs)/Pages/Usuarios/listarUsuarios", "Cargando lista...", 500);
						} else {
					const data = await response.json();
					Alert.alert("Error", data.error || "No se pudo registrar el usuario");
					hideLoading();
				}
			} catch (_error) {
				Alert.alert("Error", "No se pudo conectar con el servidor");
				hideLoading();
			}
	};

	return (
		<>
			<BackButton />
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
				
				{/* Campo de contraseña */}
				<View style={styles.passwordContainer}>
					<TextInput 
						style={styles.passwordInput} 
						placeholder="Contraseña" 
						value={form.Contrasena} 
						onChangeText={v => handleChange("Contrasena", v)} 
						secureTextEntry={!showPassword}
						placeholderTextColor="#999"
					/>
					<TouchableOpacity 
						onPress={() => setShowPassword(!showPassword)} 
						style={styles.toggleButton}
					>
						<Text style={styles.toggleText}>
							{showPassword ? "🙈" : "👁️"}
						</Text>
					</TouchableOpacity>
				</View>
				<Text style={styles.helpText}>* Mínimo 6 caracteres</Text>
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
				<TouchableOpacity style={styles.button} onPress={handleSubmit}>
					<Text style={styles.buttonText}>Registrar Usuario</Text>
				</TouchableOpacity>
			</ScrollView>
		</>
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
		color: "#333",
	},
	passwordContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		marginBottom: 8,
		paddingRight: 10,
		width: "100%",
	},
	passwordInput: {
		flex: 1,
		padding: 10,
		fontSize: 16,
		color: "#333",
	},
	toggleButton: {
		padding: 6,
	},
	toggleText: {
		fontSize: 18,
	},
	helpText: {
		fontSize: 12,
		color: "#666",
		marginBottom: 12,
		alignSelf: "flex-start",
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

>>>>>>> f8630fce5fae72300d098b4b3bbf72916a6dcb7c
export default Register;
