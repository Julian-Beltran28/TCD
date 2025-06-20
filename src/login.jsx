import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div class="bg-shapes">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
    </div>

    <div class="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div class="row w-100 justify-content-center">
            <div class="col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3">
                <div class="form-container">
                    <form method="POST" action="/login" id="loginForm">
                      
                        <div class="text-center mb-4">
                            <div class="login-icon mb-3">
                                <i class="bi bi-shield-lock"></i>
                            </div>
                            <h1 class="fw-bold">Iniciar Sesión</h1>
                            <p class="text-muted">Ingresa tus credenciales para acceder al panel de administración</p>
                        </div>

                        
                        <div class="input-group-custom mb-3">
                            <div class="input-icon">
                                <i class="bi bi-envelope"></i>
                            </div>
                            <input 
                                type="email" 
                                name="correo" 
                                class="form-control form-control-custom" 
                                placeholder="Correo electrónico" 
                                required 
                                id="email"
                            />
                        </div>

                      
                        <div class="input-group-custom mb-4">
                            <div class="input-icon">
                                <i class="bi bi-lock"></i>
                            </div>
                            <input 
                                type="password" 
                                name="contrasena" 
                                class="form-control form-control-custom" 
                                placeholder="Contraseña" 
                                required 
                                id="password"
                            />
                            <div class="password-toggle" onclick="togglePassword()">
                                <i class="bi bi-eye" id="toggleIcon"></i>
                            </div>
                        </div>


                        
                        <button type="submit" class="btn btn-custom w-100 mb-3" id="loginBtn">
                            <span class="btn-text">Iniciar sesión</span>
                            <div class="btn-loader d-none">
                                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                Iniciando...
                            </div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}



export default App
