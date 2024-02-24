package com.thoreausawyer.boardback.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "search_log")
@Table(name = "search_log")
public class SearchEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sequence;
    private String searchWord;
    private String relationWord;
    private boolean relation;

}
