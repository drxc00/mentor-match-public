"use client";
import { redirect, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Badge } from "./ui/badge";
import { XIcon } from "lucide-react";
import { topics } from "@/utils/topics";
import { UploadButton } from "@/utils/uploadthing";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "./ui/use-toast";



const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(50),
  name: z
    .string()
    .min(2, {
      message: "Must be atleast 2 characters.",
    })
    .max(50),
  email: z.string().email(),
  university_number: z.string(),
  program: z.string(),
  role: z.string(),
});

export default function UserProfile() {

  const { data: session, status, update }: any = useSession();
  const router = useRouter();

  /**
   * Handles specializations/tag inputs
   * tags is initialized upon render based on the 
   * tags of the user
   * 
   */
  const [tags, setTags]: any[] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  const [profilePicture, setProfilePicture] = useState("");
  /**
   * specializations/tags array, use for checking if the specialization is
   * already added to the user profile
   */
  const specializationTags: string[] = topics

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      university_number: "",
      program: "",
      role: "",
    },
  });

  useEffect(() => {
    if (session) {
      const { user }: any = session;
      form.reset({
        username: user.username,
        name: user.name || "", // You can set default values for other fields as needed
        email: user.email || "",
        university_number: user.university_number || "",
        program: user.program || "",
        role: user.role || "",
      });

      // set tags 
      setTags(session.user.tags);
      setProfilePicture(session.user.profile_picture);
    }
  }, [session, form, setTags]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Redirect if user is not authenticated
  if (!session) {
    router.push("/login");
  }


  const handleSelectChange = (value: any) => {
    setSelectedValue(value);
  };

  // handle specialization removal
  const removeSpecialization = (value: string) => {

    const newTagsArr = tags.filter((tag: string) => {
      return tag !== value;
    })
    setTags(newTagsArr); // to simply refresh 
  }


  function addTags() {
    if (selectedValue && !tags.includes(selectedValue)) {
      const newArr: string[] = [...tags]
      newArr.push(selectedValue);
      setTags(newArr);
    }

  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, username, university_number, email, program, role } = values;
    try {
      const result = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: session.user._id,
          username: username,
          name: name,
          university_number: university_number,
          email: email,
          program: program,
          role: role,
          specializations: tags || []
        }),
      });

      await update({ username, name, email, tags: tags, profile_picture: session.user.profile_picture });

      if (result.ok) {
        router.refresh();
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
      } else {
        toast({
          title: "Update Failed",
          variant: "destructive",
          description: "Failed to update profile!",
        });
        return result.json();
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="flex gap-4 items-center" >
        <Avatar className=" size-20">
          <AvatarImage src={profilePicture} alt="@shadcn" />
          <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <UploadButton
            className="ut-button:bg-maroon"
            endpoint="imageUploader"
            onClientUploadComplete={async (res) => {
              // Do something with the response
              toast({
                title: "Success",
                description: "Upload Successful",
              })

              await update({
                username: session.user.username,
                name: session.user.name,
                email: session.user.email,
                tags: session.user.tags,
                profile_picture: res[0].url,
              });

              router.refresh();
            }}

            onUploadError={(error: Error) => {
              // Do something with the error.
              toast({
                title: "Error",
                description: "Error with uploading",
              })
            }}
          />
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input className="bg-gold-muted" placeholder={session.user.username} {...field} />
                </FormControl>
                <FormDescription>
                  This is your username. It is unique to you.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input className="bg-gold-muted" placeholder={session.user.name} {...field} />
                </FormControl>
                <FormDescription>This is your display name.</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="university_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University Number</FormLabel>
                <FormControl>
                  <Input className="bg-gold-muted"
                    placeholder={session.user.university_number}
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormDescription>
                  This is your University Number! You cannot edit this.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Email</FormLabel>
                <FormControl>
                  <Input className="bg-gold-muted" placeholder={session.user.email} {...field} />
                </FormControl>
                <FormDescription>Your school email.</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="program"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Current Program</FormLabel>
                <FormControl>
                  <Input className="bg-gold-muted" placeholder={session.user.program} {...field} disabled />
                </FormControl>
                <FormDescription>
                  Program you are currently enrolled in.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Role in MentorMatch</FormLabel>
                <FormControl>
                  <Input className="bg-gold-muted" placeholder={session.user.role} {...field} disabled />
                </FormControl>
                <FormDescription>
                  This is your role. To change it, make a request to an admin.
                </FormDescription>
              </FormItem>
            )}
          />

          {session.user.role == "tutor" ? (
            <div className="flex gap-2 mt-2 flex-col">
              <div className="flex gap-2">
                <p>Specializations</p>
                {tags.map((tag: any, index: number) => (
                  <Badge key={index}>
                    <div className="flex gap-1 items-center">
                      {tag}
                      <span onClick={() => removeSpecialization(tag)}>
                        <XIcon size={15} />
                      </span>
                    </div>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add a specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializationTags.map((specialization: string, index: number) => (

                      !tags.includes(specialization) ? (
                        <SelectItem value={specialization} key={index}>{specialization}</SelectItem>
                      ) : (
                        null
                      )

                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addTags}>Add</Button>
              </div>
            </div>
          ) : (
            <></>
          )}

          <Button type="submit" className="bg-maroon hover:bg-maroon-700">Update Profile</Button>
          <Button type="button" className="m-2 bg-gold-200 hover:bg-gold-500 text-maroon" onClick={() => redirect("/dashboard")}>
            Cancel
          </Button>
        </form>
      </Form>
    </>

  );
}
