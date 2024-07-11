"use client"
import {useEffect} from "react";
import {useRouter} from "next/navigation";


export default function Page() {
    const router = useRouter();
    useEffect(() => {
        // Перенаправление на страницу "Posts" по умолчанию
        router.replace("/posts");
    }, [router]);

    return null;
}