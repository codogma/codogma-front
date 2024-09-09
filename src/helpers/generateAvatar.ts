import * as jdenticon from "jdenticon";

export const generateAvatar = async (value: string, size: number): Promise<File> => {
    const svgString = jdenticon.toSvg(value, size);
    const img = new Image();
    const svgBlob = new Blob([svgString], {type: "image/svg+xml"});
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve, reject) => {
        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0, size, size);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `${value}-avatar.png`, {type: "image/png"});
                        resolve(file);
                    } else {
                        reject(new Error("Failed to create PNG blob"));
                    }
                }, "image/png");
            }
        };
        img.onerror = reject;
        img.src = url;
    });
};