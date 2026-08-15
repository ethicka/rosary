// English prayer & UI text.
// Prayer wording, capitalization, and punctuation are copied verbatim from the USCCB source pages:
// https://www.usccb.org/prayers/prayers-rosary and https://www.usccb.org/how-to-pray-the-rosary
// (Prayer to St. Joseph is the traditional Leo XIII text prayed after the Rosary; the USCCB page for
// it could not be reached at build time, so the widely published traditional wording is used.)

export interface PrayerText {
  title: string;
  lines: string[];
}

export const en = {
  meta: {
    appName: "The Holy Rosary",
  },
  prayers: {
    signOfCross: {
      title: "Sign of the Cross",
      lines: [
        "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
      ],
    } as PrayerText,
    creed: {
      title: "Apostles' Creed",
      lines: [
        "I believe in God,",
        "the Father almighty,",
        "Creator of heaven and earth,",
        "and in Jesus Christ, his only Son, our Lord,",
        "who was conceived by the Holy Spirit,",
        "born of the Virgin Mary,",
        "suffered under Pontius Pilate,",
        "was crucified, died and was buried;",
        "he descended into hell;",
        "on the third day he rose again from the dead;",
        "he ascended into heaven,",
        "and is seated at the right hand of God the Father almighty;",
        "from there he will come to judge the living and the dead.",
        "I believe in the Holy Spirit,",
        "the holy catholic Church,",
        "the communion of saints,",
        "the forgiveness of sins,",
        "the resurrection of the body,",
        "and life everlasting.",
        "Amen.",
      ],
    } as PrayerText,
    ourFather: {
      title: "Our Father",
      lines: [
        "Our Father, who art in heaven,",
        "hallowed be thy name;",
        "thy kingdom come;",
        "thy will be done on earth as it is in heaven.",
        "Give us this day our daily bread;",
        "and forgive us our trespasses",
        "as we forgive those who trespass",
        "against us;",
        "and lead us not into temptation,",
        "but deliver us from evil.",
        "Amen",
      ],
    } as PrayerText,
    hailMary: {
      title: "Hail Mary",
      lines: [
        "Hail Mary, full of grace, the Lord is with you;",
        "blessed are you among women,",
        "and blessed is the fruit of your womb, Jesus.",
        "Holy Mary, Mother of God,",
        "pray for us sinners",
        "now and at the hour of our death.",
        "Amen.",
      ],
    } as PrayerText,
    gloryBe: {
      title: "Glory Be",
      lines: [
        "Glory be to the Father, the Son, and the Holy Spirit;",
        "as it was in the beginning, is now, and ever shall be,",
        "world without end.",
        "Amen.",
      ],
    } as PrayerText,
    fatima: {
      title: "Fatima Prayer",
      lines: [
        "O my Jesus, forgive us our sins, save us from the fires of hell; lead all souls to Heaven, especially those who have most need of your mercy.",
      ],
    } as PrayerText,
    hailHolyQueen: {
      title: "Hail, Holy Queen",
      lines: [
        "Hail, holy Queen, mother of mercy,",
        "our life, our sweetness, and our hope.",
        "To you we cry, poor banished children of Eve;",
        "to you we send up our sighs,",
        "mourning and weeping in this valley of tears.",
        "Turn, then, most gracious advocate,",
        "your eyes of mercy toward us;",
        "and after this, our exile,",
        "show unto us the blessed fruit of your womb, Jesus.",
        "O clement, O loving, O sweet Virgin Mary.",
      ],
    } as PrayerText,
    versicleResponse: {
      title: "Versicle and Response",
      lines: [
        "V. Pray for us, O holy Mother of God.",
        "R. That we may be made worthy of the promises of Christ.",
      ],
    } as PrayerText,
    closingPrayer: {
      title: "Let Us Pray",
      lines: [
        "Let us pray: O God, whose Only Begotten Son, by his life, Death, and Resurrection, has purchased for us the rewards of eternal life, grant, we beseech thee, that while meditating on these mysteries of the most holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen.",
      ],
    } as PrayerText,
    stJoseph: {
      title: "Prayer to St. Joseph",
      lines: [
        "To you, O blessed Joseph, we come in our tribulation, and having implored the help of your most holy Spouse, we confidently invoke your patronage also.",
        "Through that charity which bound you to the Immaculate Virgin Mother of God and through the paternal love with which you embraced the Child Jesus, we humbly beg you to look graciously upon the inheritance which Jesus Christ has purchased by his Blood, and with your power and help to succor us in our necessities.",
        "O most watchful guardian of the Holy Family, defend the chosen children of Jesus Christ. O most loving father, remove from us every stain of error and corruption. O our mighty protector, be propitious to us and from heaven assist us in our struggle with the power of darkness. As once you rescued the Child Jesus from the peril of his life, so now defend God's Holy Church from the snares of the enemy and from all adversity. Shield each one of us by your constant protection, so that, supported by your example and your aid, we may be able to live a virtuous life, to die a holy death, and to obtain eternal happiness in heaven. Amen.",
      ],
    } as PrayerText,
  },
};

export type Dictionary = typeof en;
