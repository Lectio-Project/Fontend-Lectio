'use client'

import Logo from '@/app/assets/logoLectio.svg';
import LogoWithName from '@/app/assets/logoWithName.svg';
import AlertIcon from '@/app/assets/alertIcon.svg'
import ImageBookLover from '@/app/assets/imageBookLover.svg'

import Button from "@/app/components/Button/Button";
import Input from "@/app/components/input/input";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaSignUp, signUpFormProps } from "@/app/schemas/schemaSignUp";

import './signup.css';

export default function SignUp() {
    const { handleSubmit, register, formState:{ errors } } = useForm<signUpFormProps>({
        mode: 'onSubmit',
        resolver: zodResolver(schemaSignUp)
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const handleData:SubmitHandler<signUpFormProps> = (data) => {
        console.log('submit', data);
    }

    return (
        <main className='signup-container'>
            <header><img src={LogoWithName} alt="Logo Lectio and name" className='signup-logo-with-name'/></header>
            <section className='signup-content'>
                <section className='signup-left-side'>
                    <img src={ImageBookLover} alt="" className='signup-book-lover' />
                    <h4 className='signup-body-desktop'>Embarque na aventura de conhecer o melhor da literatura brasileira</h4>
                </section>
                <section className="signup-page">
                    <header><img src={Logo} alt="Logo Lectio" className='signup-logo'/></header>
                    <h2 className='signup-title'>Cadastre-se</h2>
                    <h4 className='signup-body-mobile'>Embarque na aventura de conhecer o melhor da literatura brasileira</h4>

                    <form className="signup-form" onSubmit={handleSubmit(handleData)}>
                        <Input 
                            register={register('name', {required: 'campo obrigatório'})}  
                            errorMessage={errors.name && errors.name.message}
                            label="E-mail" placeholder="Digite seu nome completo" type="text" 
                        />

                        <Input 
                            register={register('email', {required: 'campo obrigatório'})}  
                            errorMessage={errors.email && errors.email.message} 
                            label="Senha" placeholder="Digite seu endereço de e-mail" type="email"
                        />

                        <Input 
                            register={register('password', {required: 'campo obrigatório'})}  
                            errorMessage={errors.password && errors.password.message} 
                            label="Senha" placeholder="Digite sua senha" type={showPassword ? 'text' : 'password'}
                            showPassword={showPassword} toggleShowPassword={() => setShowPassword(!showPassword)}
                        />
                        
                        <Input
                            register={register('passwordConfirmation', {required: 'campo obrigatório'})}  
                            errorMessage={errors.passwordConfirmation && errors.passwordConfirmation.message} 
                            label="Confirmar Senha" placeholder="Digite sua senha novamente" type={showPasswordConfirmation ? 'text' : 'password'}
                            showPassword={showPasswordConfirmation} toggleShowPassword={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        />
                        <section>
                            <label className='signup-checkbox'>
                                <input type='checkbox' defaultChecked={false}
                                    {...register('termsAndConditions', { required: 'campo obrigatório' })} />
                                Concordo em fornecer meus dados para a criação desta conta e declaro que li e aceito os termos e condições
                            </label>
                            {errors.termsAndConditions && (
                                <div className='error-container error-checked'>
                                    <img src={AlertIcon} className='alert-icon'/>
                                    <p className='error-message-input'>{errors.termsAndConditions.message}</p>
                                </div>
                            )}
                        </section>

                        <Button title='Cadastrar' type='submit' className={!errors ? 'active' : 'disabled'} disabled={!errors ? '' : 'disabled'}/>
                    </form>

                    <span className="signup-redirect">Já tem uma conta?<a href="./signIn">Faca seu login</a></span>
                </section>
            </section>
            <section className="signup-footer">
                <span>Copyright 2022. Todos os direitos reservados.</span>
            </section>
        </main>
    )
}