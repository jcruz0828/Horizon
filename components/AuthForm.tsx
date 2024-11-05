"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";




// Define form with useForm

// Define the submit handler


const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const formSchema = authFormSchema(type)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:""
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const data = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName
      }
     if(type === 'sign-up'){
       const newUser = await signUp(data);
       setUser(newUser)
     }
     
     if(type === 'sign-in'){
      const response = await signIn({
        email: data.email,
        password:data.password
      });
      if(response){
        router.push('/')
      }
     }
    } catch (error) {
      console.log(error)
    }
    finally{
      setIsLoading(false)
    }
  }

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
            className="h-6 w-6"
          />
          <h1 className="text-2xl font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-8">
          <h1 className="text-gray-900 text-2xl lg:text-3xl font-semibold">
            {user ? "Link Account" : type === "sign-in" ? "Sign-In" : "Sign-Up"}
          </h1>
          <p className="text-base font-normal text-gray-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{"plaid link"}</div>
      ) : (
        <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {type === 'sign-up' && (
            <>
            <div className="flex  gap-4">
             <CustomInput
            name = 'firstName'
            control = {form.control}
            placeholder= 'Enter your first name'
            label = 'First Name'
            />
            <CustomInput
            name = 'lastName'
            control = {form.control}
            placeholder= 'Enter your last name'
            label = 'Last Name'
            />
            </div>
            <CustomInput
            name = 'address1'
            control = {form.control}
            placeholder= 'Enter your specific address'
            label = 'Address'
            />
             <CustomInput
            name = 'city'
            control = {form.control}
            placeholder= 'Enter your  city'
            label = 'City'
            />
            <div className="flex  gap-4">
            <CustomInput
            name = 'state'
            control = {form.control}
            placeholder= 'ex: CA'
            label = 'State'
            />
            <CustomInput
            name = 'postalCode'
            control = {form.control}
            placeholder= 'ex: 92201'
            label = 'Postal Code'
            />
            </div>
            <div className="flex  gap-4">
            <CustomInput
            name = 'datOfBirth'
            control = {form.control}
            placeholder= 'YYYY-MM-DD'
            label = 'Date of Birth'
            />
              <CustomInput
            name = 'ssn'
            control = {form.control}
            placeholder= 'ex: 1234'
            label = 'SSN'
            />
            </div>
            </>)}
          <CustomInput
            name = 'email'
            control = {form.control}
            placeholder= 'Enter your email'
            label = 'Email'
            />

            <CustomInput
            name = 'password'
            control = {form.control}
            placeholder= 'Enter your password'
            label = 'Password'
            />
            <div className="flex flex-col size-full">
            <Button 
            type="submit" 
            className="form-btn"
            disabled = {isLoading}
            >
              {isLoading?(
              <>
              <Loader2
              className="animate-spin"

              />&nbsp;
              Loading...
              </>
              )
              :
              type === 'sign-in'
              ?'Sign in'
              :'Sign up'
              }
            </Button>
            </div>
          </form>
        </Form>
        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600">
            {type === 'sign-in'
            ?"Don't have an account?"
            : "Already have an account"
            }
          </p>
          <Link className="form-link" 
          href = {type ==='sign-in'
            ?"/sign-up"
            :"/sign-in"
          }
          >
            {type ==='sign-in'
            ?"Sign-up"
            :"Sign-in"
          }
          </Link>
        </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
