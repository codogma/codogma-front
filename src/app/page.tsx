"use client"
import {useEffect} from "react";
import {useRouter} from "next/navigation";


export default function Page() {
    const router = useRouter();
    useEffect(() => {
        // Перенаправление на страницу "Articles" по умолчанию
        router.replace("/articles");
    }, [router]);

    return null;
}