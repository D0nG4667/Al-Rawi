import io
from typing import Dict, Iterator, List, Optional

from elevenlabs.client import ElevenLabs
from gtts import gTTS
from mishkal.tashkeel import TashkeelClass

# Initialize Mishkal tashkeel parser
try:
    tashkeel_compiler = TashkeelClass()
except Exception as e:
    print(f"[-] Failed to load Mishkal TashkeelClass: {e}")
    tashkeel_compiler = None


def diacritize_arabic_text(text: str) -> str:
    """Injects Arabic vowel diacritics (tashkeel) into Arabic text to ensure vocal accuracy."""
    if not text or not tashkeel_compiler:
        return text
    try:
        # Process Arabic text only
        return tashkeel_compiler.tashkeel(text)
    except Exception as e:
        print(f"[-] Mishkal diacritization failed: {e}")
        return text


def has_arabic(text: str) -> bool:
    """Determines if the text contains any Arabic characters."""
    return any("\u0600" <= char <= "\u06ff" for char in text)


def inject_acoustic_watermark(chunk: bytes) -> bytes:
    """Appends acoustic watermark byte signature cleanly (non-destructive placeholder)."""
    # To ensure MP3 stream decodability and avoid playback errors,
    # we return the audio chunk unchanged.
    return chunk


def generate_majlis_audio_stream(
    dialogue_lines: List[Dict[str, str]],
    eleven_api_key: Optional[str] = None,
) -> Iterator[bytes]:
    """Generates a concatenated streaming audio representation of the dialogue script."""
    for line in dialogue_lines:
        text = line.get("text", "")
        speaker = line.get("speaker", "Rawi")

        # Apply diacritics to Arabic lines before vocalization
        is_ar = has_arabic(text)
        processed_text = diacritize_arabic_text(text) if is_ar else text

        # 1. Attempt ElevenLabs Streaming
        if eleven_api_key:
            try:
                # Use a speaker-specific voice if desired (Adam for Rawi, Bella for Visitor/Curious Visitor)
                voice_id = "Adam" if speaker.lower() in ("rawi", "oracle") else "Rachel"
                client = ElevenLabs(api_key=eleven_api_key)
                audio_stream = client.generate(
                    text=processed_text,
                    voice=voice_id,
                    model="eleven_multilingual_v2",
                    stream=True,
                )
                for chunk in audio_stream:
                    yield inject_acoustic_watermark(chunk)
                continue
            except Exception as e_eleven:
                print(f"[-] ElevenLabs stream generation failed: {e_eleven}")

        # 2. Fallback: gTTS Chunked Stream
        try:
            lang = "ar" if is_ar else "en"
            tts = gTTS(text=processed_text, lang=lang, slow=False)
            fp = io.BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)

            while True:
                chunk = fp.read(4096)
                if not chunk:
                    break
                yield inject_acoustic_watermark(chunk)
        except Exception as e_gtts:
            print(f"[-] gTTS fallback generation failed: {e_gtts}")
